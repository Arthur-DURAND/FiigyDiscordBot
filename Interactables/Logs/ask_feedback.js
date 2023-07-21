const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "ask_feedback",
	async execute(interaction) {

        try {

            if(!interaction.guild)
				console.log("Error ask_feedback : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"ask_feedback","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"ask_feedback",null)

            let channel_id = null
            if(interaction.customId){
                    let params = interaction.customId.split("?")

                    if(params.length > 1){
                        channel_id = params[1]
                    } else {
                            logs.error(interaction.guild, interaction.user, "ask_feedback", "No channel_id found in customId")
                    }
            }

            const modal = new ModalBuilder()
            .setCustomId('log_feedback?'+channel_id)
            .setTitle('Entre ton feedback ici')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('feedback')
                            .setLabel("Merci :)")
                            .setStyle(TextInputStyle.Paragraph)
                    )
            )
        
            await interaction.showModal(modal);

        } catch (error) {
            if(interaction)
                logs.error(interaction.guild,interaction.user,"ask_feedback",error)
            else
                logs.error(null,null,"ask_feedback",error)
        }
    
    }
};