const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "settings_games",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"settings_games",null)

        let prefix = process.env.COMMU_PREFIX
        componentOptions = []
        roles = await RoleUtil.getRoleListFromString(interaction.guild, prefix)
        roles.forEach(role =>{
            componentOptions.push(
                {
                    label: role.name.replace(prefix, ''),
                    value: "settings_giverole?" + role.name, //Laisser le prefix
                })
        })

        let row = null
        let text = ""
        if(componentOptions.length == 0){
            text = `:arrow_forward: Aucun jeu pour le moment. Ajoutez le votre maintenant !`
        } else {
            componentOptions.push(
                {
                    label: 'Pas intéressé',
					description: "Retire tous les rôles actifs",
                    value: "settings_giverole?skip",
                }
            )
            row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('games')
					.setPlaceholder("Rien de sélectionné")
					.setMinValues(0)
					.setMaxValues(componentOptions.length)
					.addOptions(componentOptions),
			);           

            text = `:arrow_forward: Quelles communautés souhaites-tu rejoindre ?`
        }

		const embed = new EmbedBuilder()
			.setColor(process.env.EMBED_COLOR)
			.setTitle("Communautés de jeu")
			.setDescription(text)

        await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
	},
};