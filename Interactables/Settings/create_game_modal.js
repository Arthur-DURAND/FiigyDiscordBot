const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle  } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "create_game_modal",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"create_game_modal",null)

        const modal = new ModalBuilder()
			.setCustomId('create_game_builder')
			.setTitle('Créer une Communauté')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('gameName')
                            .setLabel("Nom du Jeu:")
                            .setStyle(TextInputStyle.Short)
                    )
            )

		await interaction.showModal(modal);
	},
};