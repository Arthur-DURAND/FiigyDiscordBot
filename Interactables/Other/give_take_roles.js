const { EmbedBuilder, roleMention } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "give_take_roles",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"give_take_roles",null)

        const [_, ...params] = interaction.customId.split("?")

        if(interaction.guild == null)
			logs.error(interaction.guild, interaction.user, "give_take_roles", "Interaction.guild is null")
		if(interaction.member == null)
			logs.error(interaction.guild, interaction.user, "give_take_roles", "Interaction.member is null")
        
        const member = await interaction.guild.members.fetch(interaction.member.id)
    
        let text = ""
        let roles = []
        params.forEach(async param => {
                RoleUtil.giveOrTakeRole(interaction.guild, member, param)
                let role = interaction.guild.roles.cache.find(role => role.name === param)
                roles.push(roleMention(role.id))
        })

        let desc = ""
        if (roles.length > 0) {
            text = (roles.length == 1) ? "Rôle ajouté/supprimé: " : "Rôles ajoutés/supprimés: "
            roles.forEach(role => {
                desc += role + " "
            })
        } else {
            text = "Aucun rôle n'est associé à ce bouton."
        }

        const embed = new EmbedBuilder()
            .setColor("#dd3d6d")
            .setTitle(text)
            .setDescription(desc)
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};