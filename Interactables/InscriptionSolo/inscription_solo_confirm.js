
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "inscription_solo_confirm",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_solo_confirm",null)

            let alumni = null
            // let pseudo = null

            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1 /* 2 */){
                    alumni = params[1] == "true"
                    // pseudo = params[2]
                } else {
                    logs.error(interaction.guild, interaction.user, "inscription_solo", "No alumni found in customId")
                }
            }

            const member = await interaction.guild.members.fetch(interaction.user)
            let log = null
            let text = null

            if(alumni){
                text = `L'inscription sur discord est terminée ! En tant qu'alumni, tu ne pourras cependant pas obtenir de lots. Ceux-ci sont réservés aux étudiants :wink:`
                // Log
                log = "alumni : "+member.user.id + " : <@" + member.user.id + ">"

                let role = await interaction.guild.roles.fetch(process.env.ALUMNI_ROLE_ID)
                RoleUtil.giveRoleKnowingRole(interaction.guild,member,role)
                
            } else {
                text = `L'inscription sur discord est terminée !`
                log = "etudiant : "+member.user.id + " : <@" + member.user.id + ">"
            }
            const channel = interaction.guild.channels.cache.get(process.env.TOURNAMENT_LOG_CHANNEL_ID)
            channel.send(log)

            let role = await interaction.guild.roles.fetch(process.env.CONTENDER_ROLE_ID)
            RoleUtil.giveRoleKnowingRole(interaction.guild,member,role)
            if(interaction.channel)
                await interaction.update({ content: text, components:[], ephemeral: true })

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_solo",error)
			else
				logs.error(null,null,"inscription_solo",error)
		}
    
    }
};