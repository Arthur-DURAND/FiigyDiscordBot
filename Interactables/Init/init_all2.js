const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
const initUtils = require('./InitUtils.js')
require('dotenv').config();
const data = require('./init_data.js')

module.exports = {
	name: "init_all2",
	async execute(interaction) {

		try{

			initUtils.checkInteraction(interaction,"init_all2")
			if(!interaction)
				return

			logs.debug(interaction.guild,interaction.user,"init_all2",null)

			const [name, ...params] = interaction.values[0].split("?");
			let school_role_id = await RoleUtil.getRoleIdFromString(interaction.guild, process.env.ECOLE_PREFIX + params[0])
			data[interaction.member.id] = [school_role_id]

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
								value: 'init_all3?GIT',
							},
							{
								label: 'Notifications stream',
								description: "Lorsqu'un stream est sur le point d'être lancé",
								value: 'init_all3?Stream',
							},
							{
								label: 'Notifications event extérieur',
								description: "Annonces des Évent INSA et partenaires",
								value: 'init_all3?Évent Extérieur',
							},
							{
								label: 'Aucune notification',
								description: "Ne sélectionner que celle-ci",
								value: 'init_all3',
							},
						]),
				);

			const text = `:arrow_forward: Sélectionne tes préférences de notifications:`
			const embed = new EmbedBuilder()
				.setColor(process.env.EMBED_COLOR)
				.setTitle("Attribution des rôles")
				.setDescription(text)

			await interaction.update({ embeds: [embed], ephemeral: true , components: [row] });

		} catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"init_all2",error)
			else
				logs.error(null,null,"init_all2",error)
		}
},
};