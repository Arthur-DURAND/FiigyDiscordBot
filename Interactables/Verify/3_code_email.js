const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
   name: "code_email",
   async execute(interaction) {

      try {

         logs.debug(interaction.guild,interaction.user,"code_email",null)

         // get params
         let email = null
         if(interaction.customId){
            let params = interaction.customId.split("?")

            if(params.length > 1){
               email = params[1]
            } else {
               logs.error(interaction.guild, interaction.user, "code_email", "No email found in customId")
            }
         }

         // popup
         const modal = new ModalBuilder()
         .setCustomId('verify_email?'+email)
         .setTitle('Entre le code de vérification')
         .addComponents(
         new ActionRowBuilder()
            .addComponents(
            new TextInputBuilder()
               .setCustomId('code')
               .setLabel("Code :")
               .setStyle(TextInputStyle.Short)
            )
         )
         await interaction.showModal(modal);

      } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"code_email",error)
			else
				logs.error(null,null,"code_email",error)
		}
	}
};