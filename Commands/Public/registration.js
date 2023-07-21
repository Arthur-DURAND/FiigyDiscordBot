const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("registration")
		.setDescription("Creation d'un bouton d'inscription")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"registration",null)

			const modal = new ModalBuilder()
			.setCustomId('0_create_registration_button')
			.setTitle("Creation d'un bouton d'inscription")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('registration_channel_id')
                            .setLabel("ID du channel :")
                            .setStyle(TextInputStyle.Short)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('game_name')
                            .setLabel("Intitulé du jeu :")
                            .setStyle(TextInputStyle.Short)

                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('nb_players')
                            .setLabel("Nombre de joueur par équipe :")
                            .setStyle(TextInputStyle.Short)
                    )
            )

            await interaction.showModal(modal);
		}
}