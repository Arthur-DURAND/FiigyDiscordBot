const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "settings_minecraft",
	async execute(interaction) {

		logs.debug(interaction.guild,interaction.user,"settings_minecraft",null)

		const minecraftPrefix = process.env.MINECRAFT_PREFIX
        
        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('minecraft')
					.setPlaceholder("Rien de sélectionné")
					.setMinValues(0)
					.setMaxValues(4)
					.addOptions([
						{
							label: 'Minecraft',
							description: 'Accès au salons Minecraft',
							value: 'settings_giverole?'+ minecraftPrefix +'Minecraft',
						},
						{	
							label: 'Annonces Minecraft',
							description: "Notifications serveur Minecraft et sondages",
							value: 'settings_giverole?'+ minecraftPrefix +'Annonces Minecraft?'+ minecraftPrefix +'Minecraft',
						},
						{
							label: 'Events Minecraft',
							description: "Notification aux Évent Minecraft organisés",
							value: 'settings_giverole?'+ minecraftPrefix +'Events Minecraft?'+ minecraftPrefix +'Minecraft',
						},
						{
							label: 'Behind the scene Minecraft',
							description: "Accès au contenu créatif et avant premières",
							value: 'settings_giverole?'+ minecraftPrefix +'Plume Minecraft?'+ minecraftPrefix +'Minecraft',
						},
						{
							label: 'Pas intéressé',
							description: "Retire tous les rôles actifs",
							value: 'settings_giverole?'+ minecraftPrefix +'skip',
						},
					]),
			);

		const text = `:arrow_forward: Choissisez vos rôles pour accèder au serveur Minecraft et ne rien manquer !`
		const embed = new EmbedBuilder()
			.setColor(process.env.EMBED_COLOR)
			.setTitle("Rôles Minecraft")
			.setDescription(text)

		await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
	},
};