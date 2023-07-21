const { Client, ActivityType } = require("discord.js")
require('dotenv').config();


module.exports = {
	name: "ready",
	once: true,
	/**
	 * 
	 * @param {Client} client
	 */
	execute(client) {
		console.log(`Client is now logged in as ${client.user.username}`)

		client.user.setActivity(process.env.WATCHING, { type: ActivityType.Watching });
		client.user.setUsername(process.env.BOT_NAME);
	}
}