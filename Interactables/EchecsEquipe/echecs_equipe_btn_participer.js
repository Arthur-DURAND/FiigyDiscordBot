
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "echecs_equipe_btn_participer",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"echecs_equipe_btn_participer",null)

            // Msg si déjà participant
            const teamChessMember = await interaction.client.sequelize.models.team_chess_members.findOne({where: {discord_id: interaction.user.id}})
            if(teamChessMember){
                await interaction.reply({content:"Tu es déjà dans une équipe !", ephemeral:true})
                return
            }

            // Add player to ddb
            const amountMemberTeam1 = await interaction.client.sequelize.models.team_chess_members.count({where: {team: 0}})
            const amountMemberTeam2 = await interaction.client.sequelize.models.team_chess_members.count({where: {team: 1}})
            let teamRoleId
            let teamChannelId
            if(amountMemberTeam1 > amountMemberTeam2){
                teamRoleId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_ROLE_ID_TEAM_2"}})
                teamChannelId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_CHANNEL_ID_TEAM_2"}})
                await interaction.client.sequelize.models.team_chess_members.create({discord_id: interaction.user.id, team:1})
            } else if(amountMemberTeam1 < amountMemberTeam2){
                teamRoleId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_ROLE_ID_TEAM_1"}})
                teamChannelId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_CHANNEL_ID_TEAM_1"}})
                await interaction.client.sequelize.models.team_chess_members.create({discord_id: interaction.user.id, team:0})
            } else {
                const teamId = Math.floor(Math.random() * 2) + 1
                teamRoleId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_ROLE_ID_TEAM_"+teamId}})
                teamChannelId = await interaction.client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_CHANNEL_ID_TEAM_"+teamId}})
                await interaction.client.sequelize.models.team_chess_members.create({discord_id: interaction.user.id, team:teamId-1})
            }

            const teamRole = interaction.guild.roles.cache.find(role => role.id == parseInt(teamRoleId.value))
            const teamChannel = interaction.guild.channels.cache.get(teamChannelId.value)
            if(teamChannel){
                teamChannel.send({content:"<@"+interaction.user.id+"> vient de rejoindre l'équipe :tada:"})
            }
            const member = await interaction.guild.members.fetch(interaction.user)
            await RoleUtil.giveRoleKnowingRole(interaction.guild, member, teamRole)
            await interaction.reply({content:"Tu as rejoins l'équipe <@&"+teamRoleId.value+"> !", ephemeral:true})

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"echecs_equipe_btn_participer",error)
			else
				logs.error(null,null,"echecs_equipe_btn_participer",error)
		}
    
    }
};