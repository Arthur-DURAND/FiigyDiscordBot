
function startSchedules(client) {
	const schedule = require("node-schedule")
	const WORDS = require("../Interactables/Wordle/mots.js")
	const { Op, Transaction } = require('sequelize')
	const RoleUtil = require('../Utils/RoleUtil.js');
	const logs = require('../Utils/Logs.js');
	const { EmbedBuilder } = require("discord.js")


	let rule = new schedule.RecurrenceRule();
	rule.tz = 'Europe/Paris';
	rule.second = 0
	rule.minute = 0
	rule.hour = 6

	schedule.scheduleJob(rule, async () => {

		const guild = client.guilds.cache.get(process.env.PRODUCTION_GUILD_ID)
		const channel = client.channels.cache.get(process.env.WORDLE_PLAY_CHANNEL_ID);


		const seasonEnds = await client.sequelize.models.singleton.findOne({
			where: {
				name: "WORDLE_SEASON_ENDS"
			}
		})
		let seasonEndsDate
		if(!seasonEnds || !seasonEnds.value){
			seasonEndsDate = new Date()
		} else {
			seasonEndsDate = new Date(Date.parse(seasonEnds.value))
		}
		if(seasonEndsDate - new Date() < 1000*60*60*12){ // 12h
			// Update season end
			seasonEndsDate = new Date()
			seasonEndsDate.setMonth(seasonEndsDate.getMonth() + parseInt(process.env.WORDLE_SEASON_LENGTH_MONTHS))
			seasonEndsDate.setDate(1)
			seasonEndsDate.setHours(5)
			seasonEndsDate.setMinutes(59)
			seasonEndsDate.setSeconds(0)
			await client.sequelize.models.singleton.update({ value: seasonEndsDate.toString() }, {
				where: {
					name: "WORDLE_SEASON_ENDS"
				}}
			);
			// Get mvp
			const mostWins = await client.sequelize.models.discord_games.max("wordle_wins")
			if(mostWins > 0){
				const leastTries = await client.sequelize.models.discord_games.min("wordle_tries", {where: {wordle_wins: mostWins}})
				const winnersUserStats = await client.sequelize.models.discord_games.findAll({
					where: {
						wordle_wins: mostWins,
						wordle_tries: leastTries
					}}
				);
				// Log TODO
				let message = "Créer puis ajouter le rôle aux gagnants de la saison de wordle :"
				for(const userStats of winnersUserStats){
					message += "\n <@"+userStats.discord_id+"> "+userStats.discord_id
				}
				logs.todo(guild, message)
	
				// Announcement
				message = "### La saison de wordle vient de finir ! Félicitations au(x) gagnant(s) qui ont totalisés " + mostWins + " victoires !"
				for(const userStats of winnersUserStats){
					message += "\n- <@"+userStats.discord_id+"> :tada:"
				}
				message += "\n### Les victoires ont été réinitialisées, une nouvelle saison commence !"
				const embed = new EmbedBuilder()
                    .setColor("#56203d")
                    .setTitle("Félicitations !")
                    .setDescription(message)
                channel.send({content: "<@&"+process.env.WORDLE_ROLE_ID+">", embeds: [embed]})
				// Reset stats
				await client.sequelize.models.discord_games.update({ wordle_wins: 0}, {where: {wordle_wins: {[Op.not]: 0}}});
				await client.sequelize.models.discord_games.update({ wordle_tries: 0}, {where: {wordle_tries: {[Op.not]: 0}}});
			} else {
				message = "### Une nouvelle saison de wordle commence !"
				const embed = new EmbedBuilder()
                    .setColor("#56203d")
                    .setDescription(message)
                channel.send({content: "<@&"+process.env.WORDLE_ROLE_ID+">", embeds: [embed]})
				// Reset stats
				await client.sequelize.models.discord_games.update({ wordle_wins: 0}, {where: {wordle_wins: {[Op.not]: 0}}});
				await client.sequelize.models.discord_games.update({ wordle_tries: 0}, {where: {wordle_tries: {[Op.not]: 0}}});
			}
		}

		// New word
		let word = WORDS[Math.floor(Math.random() * 522)]
		await client.sequelize.models.singleton.update({ value: word }, {
			where: {
				name: "WORDLE"
			}}
		);

		// Reset "played_today"
		await client.sequelize.models.discord_games.update({ wordle_words_played: ""}, {where: {wordle_words_played: {[Op.not]: ""}}});

		channel.send("### :arrow_forward:   Le mot du jour à été généré !")
	})

	return console.log("Schedules started.")
}

module.exports = { startSchedules }
