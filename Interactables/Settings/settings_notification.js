const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "settings_notification",
	async execute(interaction) {

		logs.debug(interaction.guild,interaction.user,"settings_notification",null)

		const notifPrefix = process.env.NOTIF_PREFIX
        
        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('notifications')
					.setPlaceholder("Rien de sélectionné")
					.setMinValues(0)
					.setMaxValues(3)
					.addOptions([
						{
							label: 'Notifications GIT',
							description: 'Informations du GIT (Tournois)',
							value: 'settings_giverole?'+ notifPrefix +'GIT',
						},
						{
							label: 'Notifications stream',
							description: "Lorsqu'un stream est sur le point d'être lancé",
							value: 'settings_giverole?'+ notifPrefix +'Stream',
						},
						{
							label: 'Notifications Évent extérieur',
							description: "Annonces des Évent INSA et partenaires",
							value: 'settings_giverole?'+ notifPrefix +'Évent Extérieur',
						},
						{
							label: 'Aucune notification',
							description: "Retire tous les rôles actifs",
							value: 'settings_giverole?'+ notifPrefix +'skip',
						},
					]),
			);

		const text = `:arrow_forward: Ne manquez plus aucune info ! Sélectionnez vos préférences:`
		const embed = new EmbedBuilder()
			.setColor(process.env.EMBED_COLOR)
			.setTitle("Rôles de Notification")
			.setDescription(text)

		await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
	},
};