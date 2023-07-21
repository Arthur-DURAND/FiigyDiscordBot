const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js")

const { loadCommands } = require("../../Handlers/commandHandler")
const { loadEvents } = require("../../Handlers/eventHandler")
const logs = require('../../Utils/Logs.js');


module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reload your events/commands.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((options) =>
			options
				.setName("events")
				.setDescription("Reload your events"))
		.addSubcommand((options) => 
			options
			.setName("commands")
			.setDescription("Reload your commands")),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {
		if(!interaction.options)
			logs.error(interaction.guild,interaction.user,"reload","interaction.options is null")

		logs.debug(interaction.guild,interaction.user,"reload",null)
		
		const sub = interaction.options.getSubcommand()
		switch(sub) {
			case "events": {
				loadEvents(client)
				interaction.reply({content: "Reloaded the events."})
			}
			break
			case "commands": {
				loadCommands(client)
				interaction.reply({content: "Reloaded the commands."})
			}
			break
		}
	}
}