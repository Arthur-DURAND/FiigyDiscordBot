
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const { Transaction } = require('sequelize')

module.exports = {
	name: "inscription_decline",
	async execute(interaction) {

        const t = await interaction.client.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        });

        try {

            const guild = interaction.client.guilds.cache.get(process.env.PRODUCTION_GUILD_ID)


            logs.debug(guild,interaction.user,"inscription_decline",null)

            // Get team name
            let team_name = null
            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1){
                    team_name = params[1]
                } else {
                    await t.rollback();
                    logs.error(guild, interaction.user, "inscription_decline", "No team_name found in customId")
                    return
                }
            }

            // Get team id from team name
            const team = await interaction.client.sequelize.models.team.findOne({ where: { name: team_name}, transaction: t })
            if(!team){
                await t.rollback();
                interaction.reply({content: "Cette équipe n'existe plus !", ephemeral: true})
                return
            }

            // Get all ids
            const team_members = await interaction.client.sequelize.models.team_member.findAll({ where: {team_id: team.id}, transaction: t })
            if(!team_members){
                await t.rollback();
                interaction.reply({content: "Il n'y a personne dans cette équipe ! Etrange...", ephemeral: true})
                return
            }

            let ready = true

            if(guild){
                for(let team_member of team_members){
                    if(!team_member.ready){
                        ready = false
                    }
                    let member = await guild.members.fetch(team_member.discord_id)
                    if(member && member.user){
                        member.user.send("Quelqu'un a refusé l'invitation à l'équipe `"+team_name+"`. Celle-ci a été supprimée !")
                    }
                }
            }

            await interaction.client.sequelize.models.team.destroy({ where: {id: team.id}, transaction: t })
            
            if(ready){
                let logChannel = await interaction.client.channels.cache.get(process.env.TOURNAMENT_LOG_CHANNEL_ID);
                if(logChannel){
                    logChannel.send("L'équipe `"+team_name+"` a été supprimée !")
                }
            }

            await t.commit();
        
            await interaction.reply("Fait !");

        } catch (error) {
            await t.rollback();
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_decline",error)
			else
				logs.error(null,null,"inscription_decline",error)
		}
    
    }
};