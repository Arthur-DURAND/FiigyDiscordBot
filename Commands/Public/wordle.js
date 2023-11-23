const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const { Op, Transaction } = require('sequelize')


module.exports = {
	data: new SlashCommandBuilder()
		.setName("wordle")
		.setDescription("Commandes liées au wordle")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addSubcommand(subcommand  => subcommand 
			.setName("jouer")
			.setDescription("Lance une partie de wordle."))
		.addSubcommand(subcommand  => subcommand 
			.setName("résultats")
			.setDescription("Affiche différents tableaux de scores.")),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			logs.debug(interaction.guild,interaction.user,"wordle",null)

			if(interaction.channelId !== process.env.WORDLE_PLAY_CHANNEL_ID){
				await t.rollback();
				await interaction.reply({content: "Ce n'est pas le bon channel pour cette commande !", ephemeral: true})
				return
			}


			if (interaction.options.getSubcommand() === "jouer") {

				const t = await interaction.client.sequelize.transaction({
					isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
				})

				try {
					if(!interaction.guild){
						await t.rollback();
						console.log("Error wordle : interaction.guild is null")
					}

					logs.debug(interaction.guild,interaction.user,"wordle jouer",null)

					if(interaction.channelId !== process.env.WORDLE_PLAY_CHANNEL_ID){
						await t.rollback();
						await interaction.reply({content: "Ce n'est pas le bon channel pour cette commande !", ephemeral: true})
						return
					}

					let user_game_stats = await interaction.client.sequelize.models.discord_games.findOne({
						where: {
							discord_id: interaction.user.id
						}}
					);
					let words_played
					if(!user_game_stats){
						await interaction.client.sequelize.models.discord_games.create({
							discord_id: interaction.user.id,
							wordle_wins: 0,
							wordle_words_played: ""
						}, { transaction: t })
						words_played = ""
					} else {
						words_played = user_game_stats.wordle_words_played
					}

					const word = await interaction.client.sequelize.models.singleton.findOne({
						where: {
							name: "WORDLE"
						}}
					)
					if(!word || !word.value){
						await t.rollback();
						logs.warn(interaction.guild,interaction.user,"wordle","Impossible to access word")
						await interaction.reply({content: "Une erreur s'est produite !", ephemeral: true})
						return
					}

					const { displayWordle } = require("../../Interactables/Wordle/wordle_display")
					const displayData = await displayWordle(interaction, word.value.toUpperCase(), words_played)

					await t.commit();

					if(displayData[2] || displayData[3]) {
						await interaction.reply({embeds: [displayData[0]], ephemeral:true})
					} else {
						await interaction.reply({embeds: [displayData[0]], components:[displayData[1]], ephemeral:true})
					}

				} catch (error) {
					await t.rollback();
					if(interaction)
						logs.error(interaction.guild,interaction.user,"wordle",error)
					else
						logs.error(null,null,"wordle",error)
				}
			} else if(interaction.options.getSubcommand() == "résultats"){

				try {

					logs.debug(interaction.guild,interaction.user,"résultats",null)

					
					const author = await interaction.guild.members.fetch(interaction.user)
					let userFound = false
					const usersStatsSeason = await interaction.client.sequelize.models.discord_games.findAll({
						order: [
							['wordle_wins', 'desc'],
							['wordle_tries', 'asc']
						],
						limit : 10,
					});
					const embedSeason = new EmbedBuilder()
						.setColor("#56203d")
						.setTitle("Résultats de la saison")
					for(let i=0 ; i<Math.min(usersStatsSeason.length, 10) ; i++){
						const userStats = usersStatsSeason[i]
						if(userStats && userStats.wordle_wins > 0){
							const member = await interaction.guild.members.fetch(userStats.discord_id)
							if(member){
								embedSeason.addFields(
									{ name:"#"+(i+1)+" " + member.displayName, value: userStats.wordle_wins +" victoires en "+userStats.wordle_tries+" essais"}
								)
							}
							if(interaction.user.id == userStats.discord_id){
								userFound = true
							}
						}
					}
					if(!userFound){
						const userStatsSeason = await interaction.client.sequelize.models.discord_games.findOne({
							where: {discord_id: interaction.user.id}
						})
						const wordle_wins = userStatsSeason ? userStatsSeason.wordle_wins : 0
						const wordle_tries = userStatsSeason ? userStatsSeason.wordle_tries : 0
						const moreWins = await interaction.client.sequelize.models.discord_games.count({
							where: {wordle_wins: {[Op.gt]: wordle_wins}}
						})
						const lessTries = await interaction.client.sequelize.models.discord_games.count({
							where: {
								wordle_wins: wordle_wins,
								wordle_tries: {[Op.lt]: wordle_tries}
							}
						})
						embedSeason.addFields(
							{ name:"#"+(moreWins + lessTries + 1)+" " + author.displayName, value: wordle_wins +" victoires en "+wordle_tries+" essais"}
						)
					}
					userFound = false
					const usersStatsGlobal = await interaction.client.sequelize.models.discord_games.findAll({
						order: [
							['wordle_global_wins', 'desc'],
						],
						limit : 10,
					});
					const embedGlobal = new EmbedBuilder()
						.setColor("#56203d")
						.setTitle("Résultats globaux")
					for(let i=0 ; i<Math.min(usersStatsGlobal.length, 10) ; i++){
						const userStats = usersStatsGlobal[i]
						if(userStats && userStats.wordle_global_wins > 0){
							const member = await interaction.guild.members.fetch(userStats.discord_id)
							if(member){
								embedGlobal.addFields(
									{ name:"#"+(i+1)+" " + member.displayName, value: userStats.wordle_global_wins +" victoires"}
								)
							}
							if(interaction.user.id == userStats.discord_id){
								userFound = true
							}
						}
					}
					if(!userFound){
						const userStatsGlobal = await interaction.client.sequelize.models.discord_games.findOne({
							where: {discord_id: interaction.user.id}
						})
						const wordle_global_wins = userStatsGlobal ? userStatsGlobal.wordle_global_wins : 0
						const moreWins = await interaction.client.sequelize.models.discord_games.count({
							where: {wordle_global_wins: {[Op.gt]: wordle_global_wins}}
						})
						embedGlobal.addFields(
							{ name:"#"+(moreWins + 1)+" " + author.displayName, value: wordle_global_wins +" victoires"}
						)
					}
					interaction.reply({content: "", embeds: [embedGlobal, embedSeason]})
				} catch (error) {
					await t.rollback();
					if(interaction)
						logs.error(interaction.guild,interaction.user,"wordle",error)
					else
						logs.error(null,null,"wordle",error)
				}

			} else {
				if(interaction)
						logs.error(interaction.guild,interaction.user,"wordle","Unknown subCommand: "+interaction.options.getSubcommand())
					else
						logs.error(null,null,"wordle","Unknown subCommand")
			}
		}
}