const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Réaliser un coinflip")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error coinflip : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"coinflip",null)

			let result = Math.floor(Math.random() * 2) + 1

			let message = result === 1 ? "head" : "tail"

            await interaction.reply({content: message});

		}
}