const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("add_log")
		.setDescription("Add bot log")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error add_logs : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"add_log",null)

			const modal = new ModalBuilder()
			.setCustomId('send_log')
			.setTitle('Entrez le log à écrire')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('log')
                            .setLabel("Log :")
                            .setStyle(TextInputStyle.Paragraph)
                    )
            )

            await interaction.showModal(modal);

		}
}