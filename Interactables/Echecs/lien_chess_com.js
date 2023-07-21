
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "lien_chess_com",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"lien_chess_com",null)

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

            if(!has_alumni && !has_email){
                await interaction.reply({ content: "Tu dois d'abord vérifier ton adresse email INSA avec le bouton juste au dessus ! Si tu es alumni, contact <@288743029030912000>.", ephemeral: true })
                return
            }

            await interaction.reply({ content: process.env.CHESS_CLUB_URL, ephemeral: true })
            return

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"lien_chess_com",error)
			else
				logs.error(null,null,"lien_chess_com",error)
		}
    
    }
};