
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const utils = require('./utils')

module.exports = {
	name: "joueur_sans_equipe_valider",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"joueur_sans_equipe_valider",null)

            const modal = utils.get_modal()

            const member = await interaction.guild.members.fetch(interaction.user)

            const [_, student] = interaction.customId.split("?")

            if(student == "true"){
                modal.setCustomId('modal_joueur_sans_equipe?etudiant?update')
                await interaction.showModal(modal);
            } else {
                modal.setCustomId('modal_joueur_sans_equipe?alumni?update')
                const role = interaction.guild.roles.cache.find(role => role.id === process.env.ALUMNI_ROLE_ID)
                RoleUtil.giveRoleKnowingRole(interaction.guild, member, role)
                await interaction.showModal(modal);
            }

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"joueur_sans_equipe_valider",error)
			else
				logs.error(null,null,"joueur_sans_equipe_valider",error)
		}
    
    }
};