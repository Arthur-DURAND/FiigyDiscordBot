const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
const initUtils = require('./InitUtils.js')
require('dotenv').config();

module.exports = {
	name: "init_all3",
	async execute(interaction) {

        try {

            initUtils.checkInteraction(interaction,"init_all3")

            if(!interaction)
                return

            logs.debug(interaction.guild,interaction.user,"init_all3",null)

            initUtils.fillMemberRole(interaction,"init_all3",process.env.NOTIF_PREFIX)

            const prefix = process.env.COMMU_PREFIX
            componentOptions = []
            roles = await RoleUtil.getRoleListFromString(interaction.guild, prefix)
            roles.forEach(role =>{
                componentOptions.push(
                    {
                        label: role.name.replace(prefix, ''),
                        description: 'Espace communautaire',
                        value: "init_all4?" +role.name.replace(prefix, ''),
                    })
            })

            let row = null
            let text = ""
            if(componentOptions.length == 0){
                text = `:arrow_forward: Aucun jeu pour le moment. Ajoutez le votre maintenant !`
                row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('init_all4?skip')
                        .setLabel('Skip')
                        .setStyle(ButtonStyle.Primary),
                );

            } else {
                text = `:arrow_forward: Es-tu intéressé par l'un de ces **jeux** ? La prochaine question concerne Minecraft.`
                componentOptions.push(
                    {
                        label: 'Pas intéressé',
                        description: "Ne sélectionner que celle-ci",
                        value: "init_all4",
                    }
                )

                row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('git')
                        .setPlaceholder("Rien de sélectionné")
                        .setMinValues(0)
                        .setMaxValues(componentOptions.length)
                        .addOptions(componentOptions),
                )
            }
            
            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("Attribution des rôles")
                .setDescription(text)

            await interaction.update({ embeds: [embed], ephemeral: true , components: [row] });

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"init_all3",error)
			else
				logs.error(null,null,"init_all3",error)
		}
	},
};