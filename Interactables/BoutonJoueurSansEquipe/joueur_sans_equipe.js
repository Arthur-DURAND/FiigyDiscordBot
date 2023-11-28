
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const utils = require('./utils')

module.exports = {
	name: "joueur_sans_equipe",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"joueur_sans_equipe",null)

            const modal = utils.get_modal()

            const member = await interaction.guild.members.fetch(interaction.user)

            const roles = member.roles.cache
            let has_email = false
            let has_alumni = false
            for(let role of roles){
                if(role[0] == process.env.VERIFIED_EMAIL_ROLE_ID){
                    has_email = true
                } else if(role[0] == process.env.ALUMNI_ROLE_ID){
                    has_alumni = true
                }
            }

            if(has_alumni){
                modal.setCustomId('modal_joueur_sans_equipe?alumni?reply')
                await interaction.showModal(modal);
                return
            } else if(has_email){
                const text = `Es-tu toujours à l'INSA ?`
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('joueur_sans_equipe_valider?true')
                            .setLabel('Je suis étudiant')
                            .setStyle(ButtonStyle.Primary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('joueur_sans_equipe_valider?false')
                            .setLabel('Je suis alumni')
                            .setStyle(ButtonStyle.Primary)
                    )
                if(interaction.channel){
                    await interaction.reply({ content: text, components: [row], ephemeral: true })
                }
            } else {
                if(process.env.TOURNAMENT_MIN_VERIFIED_MEMBERS < process.env.TOURNAMENT_TEAM_SIZE){
                    modal.setCustomId('modal_joueur_sans_equipe?other?reply')
                    modal.setTitle('Inscription équipe incomplète - HORS INSA')
                    await interaction.showModal(modal);
                } else {
                    await interaction.reply({ content: "Malheureusement ce tournoi est réservé aux insa*iens. Si tu es à l'INSA, n'oublie pas de vérifier ton email. Si tu es alumni, envoie un ancien certificat de scolarité à un admin.", ephemeral: true })
                }
            }

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"joueur_sans_equipe",error)
			else
				logs.error(null,null,"joueur_sans_equipe",error)
		}
    
    }
};