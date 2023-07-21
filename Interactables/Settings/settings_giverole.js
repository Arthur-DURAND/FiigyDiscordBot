const { ActionRowBuilder, roleMention, EmbedBuilder } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "settings_giverole",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"settings_giverole",null)
    
        let params = []
        interaction.values.forEach(value => {
            const [_, ...valueParams] = value.split("?");
            params.push(...valueParams)
        });

        if(interaction.guild == null)
			logs.error(interaction.guild, interaction.user, "settings_giverole", "Interaction.guild is null")
		if(interaction.member == null)
			logs.error(interaction.guild, interaction.user, "settings_giverole", "Interaction.member is null")
        
        let prefix = params[0].split("┃")[0]+"┃"
        const member = await interaction.guild.members.fetch(interaction.member.id)
        await RoleUtil.removeRoleFromString(interaction.guild, member, prefix)
    
        let text = ""
        let roles = []
        params.forEach(param => {
            if(!param.includes("skip")){
                RoleUtil.giveRole(interaction.guild, member, param)
                let role = roleMention(interaction.guild.roles.cache.find(role => role.name === param).id)
                if (!roles.includes(role))
                    roles.push(role)
            }
        })
        if (roles.length > 0) {
            text = (roles.length == 1) ? "Rôle ajouté: " : "Rôles ajoutés: "
            roles.forEach(role => {
                text += role + " "
            })
        } else {
            text = "Vous n'avez plus de rôle pour cette catégorie"
        }

        const embed = new EmbedBuilder()
			.setColor(process.env.EMBED_COLOR)
			.setTitle("Gestionnaire de rôles")
			.setDescription(text)
        
        await interaction.update({ embeds: [embed], ephemeral: true, components: [] });
	},
};