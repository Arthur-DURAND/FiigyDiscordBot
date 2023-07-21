
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "whitelist_modal",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"whitelist_modal",null)

            logs.info(interaction.guild,interaction.user,"whitelist_modal","Début whitelist")

            const roles = interaction.member.roles.cache
            let has_email
            let has_wl = false
            let has_alumni = false
            for(let role of roles){
                if(role[0] == process.env.VERIFIED_EMAIL_ROLE_ID){
                    has_email = true
                } else if(role[0] == process.env.ALUMNI_ROLE_ID){
                    has_alumni = true
                } else if(role[0] == process.env.MINECRAFT_WL_ROLE_ID){
                    has_wl = true
                    if(interaction.channel){
                        await interaction.reply({ content: "Tu peux déjà rejoindre le serveur ! Contact <@288743029030912000> si tu souhaites changer d'identifiants.", ephemeral: true })
                    }
                }
            }

            if(!has_wl && !has_alumni && !has_email){
                await interaction.reply({ content: "Tu dois d'abord vérifier ton adresse email INSA ! Contact <@288743029030912000> avec une preuve si tu es alumni INSA.", ephemeral: true })
            } else if(!has_wl){

                const modal = new ModalBuilder()
                .setCustomId('whitelist_execute')
                .setTitle('Minecraft whitelist')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('username')
                                .setLabel("Username")
                                .setStyle(TextInputStyle.Short)
                        )
                )
        
                await interaction.showModal(modal);
            }

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"whitelist_modal",error)
			else
				logs.error(null,null,"whitelist_modal",error)
		}
    }
};