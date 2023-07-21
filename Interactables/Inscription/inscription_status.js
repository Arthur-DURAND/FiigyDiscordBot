
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

            user_registered = ""
            user_not_registered = ""

            let team = teams[team_name]
            if(!team){
                interaction.reply({content: "Cette team n'est plus dans le cache du bot ! Elle est sûrement déjà inscrite, ou le bot a redémarré.", ephemeral: true})
                return
            }

            console.log(teams)
            for(const [user_id, player] of Object.entries(team)){
                if(!player["id"]){
                    user_not_registered = user_not_registered + player["username"] + " ; "
                } else {
                    user_registered = user_registered + player["username"] + " ; "
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