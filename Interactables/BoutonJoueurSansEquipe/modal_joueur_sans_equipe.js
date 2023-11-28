const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const utils = require('./utils')

module.exports = {
	name: "modal_joueur_sans_equipe",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"modal_joueur_sans_equipe",null)

            const member = await interaction.guild.members.fetch(interaction.user)

            const [_, authorStatus, replyType] = interaction.customId.split("?")
            const pseudo = interaction.fields.getTextInputValue('pseudo');
            const discord = interaction.fields.getTextInputValue('discord');
            const rang = interaction.fields.getTextInputValue('rang');
            let allies
            try {
                allies = interaction.fields.getTextInputValue('allies');
            } catch (e) {}
            if(!allies) allies = ""
            const commentaire = interaction.fields.getTextInputValue('commentaire');

            let logChannel = await interaction.client.channels.cache.get(process.env.TOURNAMENT_UNCOMPLETED_TEAM_LOG_CHANNEL_ID);
            if(logChannel){
                logChannel.send("**"+authorStatus+"** : <@"+interaction.user.id+"> "+member.displayName+" "+interaction.user.id+"\n\
- Pseudo : "+pseudo+"\n\
- Discord : "+discord+"\n\
- Rang : "+rang+"\n\
- Alliés : "+allies+"\n\
- Commentaires : "+commentaire+"\n")
            }

            if(replyType == "reply"){
                await interaction.reply({ content: "Réponse reçue !", ephemeral: true })
            } else {
                await interaction.update({ content: "Réponse reçue !", components:[], ephemeral: true })
            }


        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"modal_joueur_sans_equipe",error)
			else
				logs.error(null,null,"modal_joueur_sans_equipe",error)
		}
    
    }
};