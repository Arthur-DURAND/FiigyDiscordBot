const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const initUtils = require('./InitUtils.js')
require('dotenv').config();

module.exports = {
	name: "init_all",
	execute(interaction) {

		try {

			initUtils.checkInteraction(interaction,"init_all")
			if(!interaction)
				return

			logs.debug(interaction.guild,interaction.user,"init_all",null)

			const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('insa')
						.setPlaceholder('INSA')
						.addOptions([
							{
								label: 'INSA Centre Val de Loire',
								value: 'init_all2?CVL',
								emoji: {
									"name": "cvl",
									"id": "744713291691196457"
								}
							},
							{
								label: 'INSA Hauts-de-France',
								value: 'init_all2?Hauts-de-France',
								emoji: {
									"name": "hdf",
									"id": "744713291892260924"
								}
							},
							{
								label: 'INSA Lyon',
								value: 'init_all2?Lyon',
								emoji: {
									"name": "lyon",
									"id": "744713291787403354"
								}
							},
							{
								label: 'INSA Rennes',
								value: 'init_all2?Rennes',
								emoji: {
									"name": "rennes",
									"id": "744713291640864852"
								}
							},
							{
								label: 'INSA Rouen Normandie',
								value: 'init_all2?Rouen',
								emoji: {
									"name": "rouen",
									"id": "744713291921621103"
								}
							},
							{
								label: 'INSA Strasbourg',
								value: 'init_all2?Strasbourg',
								emoji: {
									"name": "strasbourg",
									"id": "744713292102238318"
								}
							},
							{
								label: 'INSA Toulouse',
								value: 'init_all2?Toulouse',
								emoji: {
									"name": "toulouse",
									"id": "744713291783471176"
								}
							},
							{
								label: 'Autres',
								value: 'init_all2?Autres',
							}
						]),
				);

			const text = `:arrow_forward: Sélectionne ton INSA:`
			const embed = new EmbedBuilder()
				.setColor(process.env.EMBED_COLOR)
				.setTitle("Attribution des rôles")
				.setDescription(text)

			interaction.reply({ embeds: [embed], ephemeral: true , components: [row] });

		} catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"init_all",error)
			else
				logs.error(null,null,"init_all",error)
		}
	},
};