
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const teams = require('./temp_teams.js')
const RoleUtil = require('../../Utils/RoleUtil.js');
const { Op } = require('sequelize')


module.exports = {
	name: "inscription_confirm",
	async execute(interaction) {

        try {

            const guild = interaction.client.guilds.cache.get(process.env.TOURNAMENT_GUILD_ID)

            logs.debug(guild,interaction.user,"inscription_confirm",null)

            let identifiant = null
            if(interaction.fields)
                identifiant = interaction.fields.getTextInputValue('identifiant');

            let team_name = null
            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1){
                    team_name = params[1]
                } else {
                    logs.error(guild, interaction.user, "inscription_confirm", "No team_name found in customId")
                    return
                }
            }

            // Get team id
            const team = await interaction.client.sequelize.models.team.findOne({ where: { name: team_name}})
            if(!team){
                interaction.reply({content: "Cette équipe n'existe plus !", ephemeral: true})
                return
            }

            // Check if already accepted another team
            let check_team_member = await interaction.client.sequelize.models.team_member.findAll({ where: { [Op.and]: {discord_id: interaction.user.id, ready: true, team_id: {[Op.not]: team.id}}}})
            for(let team_member of check_team_member){
                let check_team_ready = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {ready: false, team_id: team_member.team_id}}})
                if(!check_team_ready){
                    interaction.reply({content: "Tu fais déjà parti d'une autre équipe !", ephemeral: true})
                    return
                }
            }

            // Check if already accepted this team (thus == change of in game name)
            already_accepted = false
            check_team_member = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {discord_id: interaction.user.id, ready: true, team_id: team.id}} })
            if(check_team_member){
                already_accepted = true
            }

            if(!identifiant){
                interaction.reply({content: "Une erreur s'est produite avec ton identifiant. Reessaye !", ephemeral: true})
                return
            }

            // add id to data
            await interaction.client.sequelize.models.team_member.update({ ig_name: identifiant, ready: true }, {
                where: {
                    [Op.and]: {
                        discord_id: interaction.user.id, 
                        team_id: team.id
                    }
                }
            });

            if(already_accepted){
                interaction.reply({content: "Changement d'identifiant réussie !", ephemeral: true})
            } else {
                interaction.reply({content: "Inscription réussie !", ephemeral: true})
            }

            const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('inscription_status?'+ team_name)
                            .setLabel("Status")
                            .setStyle(ButtonStyle.Primary),
                );
            
            // Check if registration is finished
            registration_not_finished = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {ready: false, team_id: team.id}} })
            if(registration_not_finished){
                interaction.user.send({content: "Status de l'inscription pour le tournois "+process.env.TOURNAMENT_NAME+", équipe `"+team_name+"`.", components: [row]})
            } else {
                if(guild){                
                    team_members = await interaction.client.sequelize.models.team_member.findAll({ where: {team_id: team.id}})
                    let log_team = "**" + team.name + "**"
                    let contender_role = await guild.roles.fetch(process.env.CONTENDER_ROLE_ID)
                    
                    for(team_member of team_members){
                        log_team += "\n• <@" + team_member.discord_id + "> ; " + team_member.discord_id + " ; " + team_member.ig_name 
                        let member = await guild.members.fetch(team_member.discord_id)
                        if(member && member.user){
                            await RoleUtil.giveRoleKnowingRole(guild,member,contender_role)
                            member.user.send("Inscription pour le tournois "+process.env.TOURNAMENT_NAME+" réussie ! Ton équipe s'appelle `"+team_name+"`.")
                            // Set other team to not rdy
                            await interaction.client.sequelize.models.team_member.update({ ready: false }, {
                                where: {
                                    [Op.and]: {
                                        discord_id: team_member.discord_id, 
                                        team_id: { [Op.not]: team.id }
                                    }
                                }
                            });
                        }
                    }
                    let logChannel = await interaction.client.channels.cache.get(process.env.TOURNAMENT_LOG_CHANNEL_ID);
                    if(!logChannel){
                        logs.error(guild, interaction.user, "inscription_confirm", "Cannot get logChannel! : "+log_team)
                        return
                    }
                    logChannel.send(log_team)
                }
            }            
        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_confirm",error)
			else
				logs.error(null,null,"inscription_confirm",error)
		}
    }
};