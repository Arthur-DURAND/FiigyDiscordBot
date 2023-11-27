
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "lien_formulaire",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"lien_formulaire",null)

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

            const [_, lien_verifie, lien_alumni, lien_others] = interaction.customId.split("?")

            if(has_alumni){
                await interaction.reply({ content: lien_alumni, ephemeral: true })
                return
            } else if(has_email){
                const text = `Es-tu toujours à l'INSA ?`
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('lien_formulaire_confirm?true?'+lien_verifie+"?"+lien_alumni)
                            .setLabel('Je suis étudiant')
                            .setStyle(ButtonStyle.Primary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('lien_formulaire_confirm?false?'+lien_verifie+"?"+lien_alumni)
                            .setLabel('Je suis alumni')
                            .setStyle(ButtonStyle.Primary)
                    )
                if(interaction.channel){
                    await interaction.reply({ content: text, components: [row], ephemeral: true })
                }
            } else {
                await interaction.reply({ content: "Le lien suivant est pour les personnes extérieures à l'INSA. Si tu es étudiant INSA, vérifie ton email. Si tu es alumni, envoie un vieux certificat de scolarité à un admin.\n"+lien_others, ephemeral: true })
            }


        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"lien_formulaire",error)
			else
				logs.error(null,null,"lien_formulaire",error)
		}
    
    }
};