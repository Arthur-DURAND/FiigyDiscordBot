
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "lien_confirm",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"lien_confirm",null)

            const member = await interaction.guild.members.fetch(interaction.user)

            const [_, student, lien_verifie, lien_alumni] = interaction.customId.split("?")

            if(student == "true"){
                await interaction.update({ content: lien_verifie, components: [], ephemeral: true })
            } else {
                const role = interaction.guild.roles.cache.find(role => role.id === process.env.ALUMNI_ROLE_ID)
                RoleUtil.giveRoleKnowingRole(interaction.guild, member, role)
                await interaction.update({ content: lien_alumni, components: [], ephemeral: true })
            }

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"lien_confirm",error)
			else
				logs.error(null,null,"lien_confirm",error)
		}
    
    }
};