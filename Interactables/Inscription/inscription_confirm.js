
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const teams = require('./temp_teams.js')
const RoleUtil = require('../../Utils/RoleUtil.js');

module.exports = {
	name: "inscription_confirm",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_confirm",null)

            let identifiant = null
            if(interaction.fields)
                identifiant = interaction.fields.getTextInputValue('identifiant');

            let team_name = null
            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1){
                    team_name = params[1]
                } else {
                    logs.error(interaction.guild, interaction.user, "inscription_confirm", "No team_name found in customId")
                    return
                }
            }

            already_accepted = false
            if(teams[interaction.user.id]){
                already_accepted = true
            }

            if(!identifiant){
                interaction.reply({content: "Une erreur s'est produite avec ton identifiant. Reessaye !", ephemeral: true})
                return
            }

            if(!teams[team_name]){
                interaction.reply({content: "Une erreur s'est produite avec cette team. La team a sûrement déjà été inscrit, ou le bot a redémarré. Reessaye dans le doute !", ephemeral: true})
                return
            }

            if(!interaction.user.id in teams[team_name]){
                interaction.reply({content: "Une erreur s'est produite avec cette team. La team a sûrement déjà été inscrit, ou le bot a redémarré. Reessaye dans le doute !", ephemeral: true})
                return
            }

            // add id to data
            teams[team_name][interaction.user.id]["id"] = identifiant

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
            registration_finished = true
            let log_team = ""
            for(let [team_member_id,team_member] of Object.entries(teams[team_name])){
                if(!team_member || !team_member["id"]){
                    registration_finished = false
                } else {
                    log_team = log_team + "\n   - " + team_member_id + " : <@" + team_member_id + "> : " + team_member["username"] + " : " + team_member["id"] 
                }
            }

            if(!registration_finished){
                // Send dm
                interaction.user.send({content: "Status de l'inscription pour "+process.env.TOURNAMENT_NAME, components: [row]})
            } else {
                // Logs
                let log = team_name+" :" + log_team
                let logChannel = await interaction.client.channels.cache.get(process.env.TOURNAMENT_LOG_CHANNEL_ID);
                if(!logChannel){
                    logs.error(interaction.guild, interaction.user, "inscription_confirm", "Cannot get logChannel! : "+log)
                    return
                }
                logChannel.send(log)

                // Send dm to all
                let guild = await interaction.client.guilds.cache.get(process.env.TOURNAMENT_GUILD_ID);
                for(let team_member_id of Object.keys(teams[team_name])){
                    team_member = await guild.members.fetch(team_member_id)
                    //team_member = await interaction.client.users.fetch(team_member_id);
                    if(team_member && team_member.user){
                        await RoleUtil.giveRole(guild, team_member,process.env.CONTENDER_ROLE)

                        team_member.user.send("Inscription sur "+process.env.TOURNAMENT_NAME+" réussie !")
                    }
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