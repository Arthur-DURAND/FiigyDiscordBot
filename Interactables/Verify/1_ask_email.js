
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
   name: "ask_email",
   async execute(interaction) {

      try {

         logs.debug(interaction.guild,interaction.user,"ask_email",null)

         const member = interaction.member
         for(let role of member.roles.cache){
            if(role[0] == process.env.VERIFIED_EMAIL_ROLE_ID){
               if(interaction.channel){
                  await interaction.reply({ content: "Tu as déjà vérifié ton email ! DM <@288743029030912000> si tu souhaites le retirer de notre base de données.", ephemeral: true })
                  return
               } else {
                  return
               }
            }
         }

         user = await interaction.client.sequelize.models.user.findOne({ where: { discord_id: member.id } })
         if (user) {
            await RoleUtil.giveRole(interaction.guild, member, process.env.VERIFIED_EMAIL_ROLE)
            await interaction.reply({ content: "Email vérifié !", ephemeral: true })
            return
         }

         const modal = new ModalBuilder()
         .setCustomId('send_email')
         .setTitle('Entre ton email INSA')
         .addComponents(
            new ActionRowBuilder()
               .addComponents(
                  new TextInputBuilder()
                     .setCustomId('email')
                     .setLabel("Ton email INSA :")
                     .setStyle(TextInputStyle.Short)
               )
         )
      
         await interaction.showModal(modal);

      } catch (error) {
         if(interaction)
            logs.error(interaction.guild,interaction.user,"ask_email",error)
         else
            logs.error(null,null,"ask_email",error)
      }
   
   }
};