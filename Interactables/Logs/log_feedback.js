const logs = require('../../Utils/Logs.js');

require('dotenv').config();

module.exports = {
    name: "log_feedback",
    async execute(interaction) {

      try {

        if(!interaction.guild)
				console.log("Error log_feedback : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"log_feedback","interaction.channel is null")

        logs.debug(interaction.guild,interaction.user,"log_feedback",null)

        let channel_id = null
        if(interaction.customId){
          let params = interaction.customId.split("?")

          if(params.length > 1){
              channel_id = params[1]
          } else {
                  logs.error(interaction.guild, interaction.user, "log_feedback", "No channel_id found in customId")
          }
        }

        let feedback = null
        if(interaction.fields)
          feedback = interaction.fields.getTextInputValue('feedback');

        let channel = interaction.guild.channels.cache.get(channel_id);

        channel.send("- "+interaction.user.username+" <@"+interaction.user.id+"> arrivé il y a "+Math.floor((Date.now()-interaction.member.joinedTimestamp)/(1000*60*60*24))+" jours : \n"+feedback)

        interaction.reply({content: "Merci pour le feedback !", ephemeral: true})

      } catch (error) {
        if(interaction)
          logs.error(interaction.guild,interaction.user,"log_feedback",error)
        else
          logs.error(null,null,"log_feedback",error)
      }
    }
};