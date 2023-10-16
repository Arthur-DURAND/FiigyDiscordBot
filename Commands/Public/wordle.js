const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const { Op, Transaction } = require('sequelize')


module.exports = {
	data: new SlashCommandBuilder()
		.setName("wordle")
		.setDescription("Lance une partie de wordle.")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			const t = await interaction.client.sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
            })

			try {
				if(!interaction.guild){
					await t.rollback();
					console.log("Error wordle : interaction.guild is null")
				}

				logs.debug(interaction.guild,interaction.user,"wordle",null)

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

		}
}