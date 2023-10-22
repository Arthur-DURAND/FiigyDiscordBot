function startSchedules(client) {
	const schedule = require("node-schedule")
	const WORDS = require("../Interactables/Wordle/mots.js")
	const { Op, Transaction } = require('sequelize')
	const RoleUtil = require('../Utils/RoleUtil.js');

	let rule = new schedule.RecurrenceRule();
	rule.tz = 'Europe/Paris';

	schedule.scheduleJob('0 6 * * *', async () => {

		const guild = client.guilds.cache.get(process.env.PRODUCTION_GUILD_ID)

		let wordleFirstPlaceRole = await guild.roles.fetch(process.env.WORDLE_FIRST_PLACE_ROLE_ID)
		await RoleUtil.removeEveryoneFromRole(wordleFirstPlaceRole)
		const firstPlaceWins = await client.sequelize.models.discord_games.max("wordle_wins")
		const firstPlaceUserStats = await client.sequelize.models.discord_games.findAll({
			where: {
				wordle_wins: firstPlaceWins
			}}
		);
		for(const userStats of firstPlaceUserStats){
			const member = await guild.members.fetch(userStats.discord_id)
			if(member){
				await RoleUtil.giveRoleKnowingRole(guild, member, wordleFirstPlaceRole)
			}
		}


		let wordleSecondPlaceRole = await guild.roles.fetch(process.env.WORDLE_SECOND_PLACE_ROLE_ID)
		await RoleUtil.removeEveryoneFromRole(wordleSecondPlaceRole)
		const secondPlaceWins = await client.sequelize.models.discord_games.max("wordle_wins", {where: {wordle_wins: {[Op.lt]: firstPlaceWins}}})
		const secondPlaceUserStats = await client.sequelize.models.discord_games.findAll({
			where: {
				wordle_wins: secondPlaceWins
			}}
		);
		for(const userStats of secondPlaceUserStats){
			const member = await guild.members.fetch(userStats.discord_id)
			if(member){
				await RoleUtil.giveRoleKnowingRole(guild, member, wordleSecondPlaceRole)
			}
		}


		let wordleThirdPlaceRole = await guild.roles.fetch(process.env.WORDLE_THIRD_PLACE_ROLE_ID)
		await RoleUtil.removeEveryoneFromRole(wordleThirdPlaceRole)
		const thirdPlaceWins = await client.sequelize.models.discord_games.max("wordle_wins", {where: {wordle_wins: {[Op.lt]: secondPlaceWins}}})
		const thirdPlaceUserStats = await client.sequelize.models.discord_games.findAll({
			where: {
				wordle_wins: thirdPlaceWins
			}}
		);
		for(const userStats of thirdPlaceUserStats){
			const member = await guild.members.fetch(userStats.discord_id)
			if(member){
				await RoleUtil.giveRoleKnowingRole(guild, member, wordleThirdPlaceRole)
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

		const channel = client.channels.cache.get(process.env.WORDLE_PLAY_CHANNEL_ID);
		channel.send("### :arrow_forward:   Le mot du jour à été généré !")
	})

	return console.log("Schedules started.")
}

module.exports = { startSchedules }
