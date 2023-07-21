
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "inscription_solo",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_solo",null)

            const member = await interaction.guild.members.fetch(interaction.user)

            const roles = member.roles.cache
            let has_email = false
            let has_alumni = false
            let has_contender = false
            for(let role of roles){
                if(role[0] == process.env.VERIFIED_EMAIL_ROLE_ID){
                    has_email = true
                } else if(role[0] == process.env.ALUMNI_ROLE_ID){
                    has_alumni = true
                } else if(role[0] == process.env.CONTENDER_ROLE_ID){
                    if(interaction.channel){
                        has_contender = true
                        await interaction.reply({ content: "Tu es déjà inscrit ! DM <@288743029030912000> si tu souhaites te désinscrire.", ephemeral: true })
                    }
                }
            }

            if(!has_contender){

                if(has_alumni){
                    // Alumni
                    const text = `L'inscription sur discord est terminée ! En tant qu'alumni, tu ne pourras cependant pas obtenir de lots. Ceux-ci sont réservés aux étudiants :wink:`
                    // Log
                    const log = "alumni : "+member.user.id + " : <@" + member.user.id + ">"
                    const channel = interaction.guild.channels.cache.get(process.env.TOURNAMENT_LOG_CHANNEL_ID)
                    channel.send(log)

                    // Give role
                    const role = await interaction.guild.roles.fetch(process.env.CONTENDER_ROLE_ID)
                    RoleUtil.giveRoleKnowingRole(interaction.guild,member,role)
                    if(interaction.channel)
                        await interaction.reply({ content: text, ephemeral: true })

                } else if(has_email){
                    // Could be both
                    const text = `Seuls les étudiants INSAs peuvent obtenir les lots, mais les alumnis peuvent tout de même participer. Es-tu toujours à l'INSA ? (Un certificat de scolarité sera demandé à la remise des prix)`
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('inscription_solo_confirm?false')
                                .setLabel('Je suis étudiant')
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('inscription_solo_confirm?true')
                                .setLabel('Je suis alumni')
                                .setStyle(ButtonStyle.Primary)
                        )
                    if(interaction.channel){
                        await interaction.reply({ content: text, components: [row], ephemeral: true })
                    }

                } else {
                    // Unknown
                    const text = `Le Gaming INSA Tournament est réservé aux insa*iens ! Tu peux soit vérifier ton email insa avec le bouton ci-dessous (et ainsi concourir pour les lots), soit envoyer un message à <@288743029030912000> avec un document prouvant que tu es un alumni. N'oublie pas de te reinscrire après coup !`

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('ask_email')
                                .setLabel('Clique ici pour vérifier ton email !')
                                .setStyle(ButtonStyle.Primary)
                    )
        
                    if(interaction.channel)
                        await interaction.reply({ content: text, components: [row], ephemeral: true })

                }
            }

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_solo",error)
			else
				logs.error(null,null,"inscription_solo",error)
		}
    
    }
};