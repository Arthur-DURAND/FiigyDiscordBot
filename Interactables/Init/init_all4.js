const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const initUtils = require('./InitUtils.js')
require('dotenv').config();

module.exports = {
	name: "init_all4",
	async execute(interaction) {

		try {

			initUtils.checkInteraction(interaction,"init_all4")
			if(!interaction)
				return

			logs.debug(interaction.guild,interaction.user,"init_all4",null)

			initUtils.fillMemberRole(interaction,"init_all4",process.env.COMMU_PREFIX)

			const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('minecraft')
						.setPlaceholder("Rien de sélectionné")
						.setMinValues(0)
						.setMaxValues(4)
						.addOptions([
							{
								label: 'Minecraft sans notification',
								description: 'Accès au salons Minecraft',
								value: 'init_all5?Minecraft',
							},
							{	
								label: 'Annonces diverses Minecraft',
								description: "Notifications serveur Minecraft et sondages",
								value: 'init_all5?Annonces Minecraft?Minecraft',
							},
							{
								label: 'Events Minecraft',
								description: "Notification aux Évent Minecraft organisés",
								value: 'init_all5?Events Minecraft?Minecraft',
							},
							{
								label: 'Behind the scene Minecraft',
								description: "Accès au contenu créatif et avant premières",
								value: 'init_all5?Plume Minecraft?Minecraft',
							},
							{
								label: 'Pas intéressé',
								description: "Ne sélectionner que celle-ci",
								value: 'init_all5',
							},
						]),
				);

			const text = `:arrow_forward: Es-tu intéressé par notre serveur **Minecraft** ?`
			const embed = new EmbedBuilder()
				.setColor(process.env.EMBED_COLOR)
				.setTitle("Attribution des rôles")
				.setDescription(text)

			await interaction.update({ embeds: [embed], ephemeral: true , components: [row] });

		} catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"init_all4",error)
			else
				logs.error(null,null,"init_all4",error)
		}
	},
};