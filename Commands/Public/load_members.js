const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("load_members")
		.setDescription("Load members into cache.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error load_members : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"load_members",null)

			const members = await interaction.guild.members.fetch()
			members.forEach(member => {
				member.roles.cache
			})

            await interaction.reply({content: "Done!", ephemeral: true})

		}
}