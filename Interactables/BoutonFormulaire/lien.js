
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle, Role } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "lien",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"lien",null)

            let has_email = await RoleUtil.isUserIdVerified(interaction.client.sequelize, interaction.user.id)
            let has_alumni = await RoleUtil.isUserIdAlumni(interaction.client.sequelize, interaction.user.id)

            const [_, lien_verifie, lien_alumni, lien_others] = interaction.customId.split("?")

            if(has_alumni){
                await interaction.reply({ content: lien_alumni, ephemeral: true })
                return
            } else if(has_email){
                const text = `Es-tu toujours à l'INSA ?`
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('lien_confirm?true?'+lien_verifie+"?"+lien_alumni)
                            .setLabel('Je suis étudiant')
                            .setStyle(ButtonStyle.Primary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('lien_confirm?false?'+lien_verifie+"?"+lien_alumni)
                            .setLabel('Je suis alumni')
                            .setStyle(ButtonStyle.Primary)
                    )
                if(interaction.channel){
                    await interaction.reply({ content: text, components: [row], ephemeral: true })
                }
            } else {
                if(lien_others == "" || lien_others=="null"){
                    await interaction.reply({ content: "Ce lien est réservé aux insa*iens et alumnis ! Si tu es étudiant INSA, vérifie ton email. Si tu es alumni, envoie un vieux certificat de scolarité à un admin.", ephemeral: true })
                } else {
                    await interaction.reply({ content: "Le lien suivant est pour les personnes extérieures à l'INSA. Si tu es étudiant INSA, vérifie ton email. Si tu es alumni, envoie un vieux certificat de scolarité à un admin.\n"+lien_others, ephemeral: true })
                }
            }


        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"lien",error)
			else
				logs.error(null,null,"lien",error)
		}
    
    }
};