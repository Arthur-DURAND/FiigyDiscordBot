const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")

const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildPresences } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials 

const { loadEvents } = require("./Handlers/eventHandler")
const { loadCommands } = require("./Handlers/commandHandler")
const { loadInteracts } = require("./Handlers/interactsHandler")
const { startSchedules } = require("./Handlers/schedulesHandler")
const dbUtil = require('./Utils/dbUtil.js');

require('dotenv').config();

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildPresences], 
	partials: [User, Message, GuildMember, ThreadMember],
})

client.commands = new Collection()
client.interacts = new Collection();

client.sequelize = dbUtil.connectionInstance()

const token = process.env.IS_DEV === "true" ? process.env.DEV_TOKEN : process.env.TOKEN

client
	.login(token)
	.then(() => {
		loadEvents(client)
		loadCommands(client)
		loadInteracts(client)
		startSchedules(client)
		dbUtil.testConnection(client.sequelize)
		dbUtil.syncTables(client.sequelize)
	})
	.catch((err) => console.log(err))