
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const teams = require('./temp_teams.js')

module.exports = {
	name: "inscription_status",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_status",null)

            let team_name = null
            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1){
                    team_name = params[1]
                } else {
                    logs.error(interaction.guild, interaction.user, "inscription_confirm", "No team_name found in customId")
                }
            }

            

            // Get team id from team name
            const team = await interaction.client.sequelize.models.team.findOne({ where: { name: team_name}})
            if(!team){
                interaction.reply({content: "Cette équipe n'existe plus !", ephemeral: true})
                return
            }

            // Get all ids
            const team_members = await interaction.client.sequelize.models.team_member.findAll({ where: {team_id: team.id}})
            if(!team_members){
                interaction.reply({content: "Il n'y a personne dans cette équipe ! Etrange...", ephemeral: true})
                return
            }

            user_registered = ""
            user_not_registered = ""
            const guild = interaction.client.guilds.cache.get(process.env.TOURNAMENT_GUILD_ID)
            if(guild){
                for(let team_member of team_members){
                    let member = await guild.members.fetch(team_member.discord_id)
                    if(team_member.ready){
                        user_registered += member.displayName + " ; "
                    } else {
                        user_not_registered += member.displayName + " ; "
                    }
                }
            } else {
                for(let team_member of team_members){
                    if(team_member.ready){
                        user_registered += "<@"+team_member.discord_id + "> ; "
                    } else {
                        user_not_registered += "<@"+team_member.discord_id + "> ; "
                    }
                }
            }
            
            interaction.reply({content: "Joueurs inscrits : "+user_registered+"\nJoueurs pas encore inscrits : "+user_not_registered, ephemeral: true})
            
        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_status",error)
			else
				logs.error(null,null,"inscription_status",error)
		}

    }
};