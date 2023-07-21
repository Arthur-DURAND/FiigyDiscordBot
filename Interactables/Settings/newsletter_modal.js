const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle  } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "newsletter_modal",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"newsletter_modal",null)

        const modal = new ModalBuilder()
			.setCustomId('newsletter_register')
			.setTitle('Inscrit toi à la newsletter')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('email_perso')
                            .setLabel("Email:")
                            .setStyle(TextInputStyle.Short)
                    )
            )

		await interaction.showModal(modal);
	},
};