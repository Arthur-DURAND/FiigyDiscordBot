const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
const codes = require('./temp_codes.js')
require('dotenv').config();

module.exports = {
   name: "verify_email",
   async execute(interaction) {

      try {

         logs.debug(interaction.guild,interaction.user,"verify_email",null)

         const member = interaction.member

         // get params
         email = null
         if(interaction.customId){
            let params = interaction.customId.split("?")

            if(params.length > 1){
               email = params[1]
            } else {
               logs.error(interaction.guild, interaction.user, "verify_email", "No email found in customId")
            }
         }

         // get code
         let code = interaction.fields.getTextInputValue('code');
         code = code.replace(/\s+/g, '');

         // email in dict codes
         if(!codes[email]){
            return
         }

         // code that user is suppose to enter
         true_code = codes[email][0]

         // check time (10 mins max to avoid too much spam)
         rn = Date.now()
         if(rn - codes[email][1] > 1000 * 60 * 10) { // 10 mins
            interaction.reply({content: "Le délai de 10 minutes a été dépassé ! Reclique sur le bouton initial.", ephemeral: true})
            delete codes[email]
            return
         }
            
         // is it the right code?
         if (code != true_code.toString()) {
            interaction.update({content: "Mauvais code. Try again!", ephemeral: true})
            return
         }

         let user = await interaction.client.sequelize.models.user.findOne({ where: { email: email } })
         if (user) {
            interaction.update({content: "Cet email a déjà été vérifié. Contact un admin si tu penses qu'il s'agit d'une erreur", ephemeral: true, components: []})
            return
         }

         
         user = await interaction.client.sequelize.models.user.findOne({ where: { discord_id: member.id } })
         if (user) {
            await user.update({email: email})
         } else {
            await interaction.client.sequelize.models.user.create({
               discord_id: member.id,
               email: email
            })
         }

         await RoleUtil.giveRole(interaction.guild, member, process.env.VERIFIED_EMAIL_ROLE)
         logs.info(interaction.guild,interaction.user,"verify_email","Email vérifié")
         interaction.update({content: "Email vérifié !", ephemeral: true, components: []})
         
         delete codes[email]

      } catch (error) {
         if(interaction)
            logs.error(interaction.guild,interaction.user,"verify_email",error)
         else
            logs.error(null,null,"verify_email",error)
      }
   }
};