const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const codes = require('./temp_codes.js')
const nodemailer = require('nodemailer');

require('dotenv').config();

module.exports = {
   name: "send_email",
   async execute(interaction) {

      try {

         logs.debug(interaction.guild,interaction.user,"send_email",null)

         let email = null
         if(interaction.fields)
            email = interaction.fields.getTextInputValue('email');

         // regex email
         var email_regex = new RegExp("^[\.a-zA-Z1-9_-]+@(edu.)?(insa-[a-z]+|uphf).fr$");
         if(!email_regex.test(email)){
            interaction.reply({content: "Cet email n'est pas valide ! Il faut ton adresse email INSA. Si tu penses que c'est une erreur, contacte un admin.", ephemeral: true})
            return
         }

         // verify if already used email
         const user = await interaction.client.sequelize.models.user.findOne({ where: { email: email } })
         if (user) {
            interaction.reply({content: "Cet email a déjà été vérifié. Contact un admin si tu penses qu'il s'agit d'une erreur", ephemeral: true, components: []})
            return
         }
         
         // create code
         let code = Math.floor(Math.random() * 1000000)
         codes[email] = [code, Date.now()]

         // send email
         var transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PWD
               }
            });
            
            var mailOptions = {
               from: 'fiigy.bot@gmail.com',
               to: email,
               subject: 'Code de verification d\'email',
               text: code.toString()
            };
            
            transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                     logs.error(interaction.guild, interaction.user, "send_email", error)
               } else {
                     logs.info(interaction.guild,interaction.user,"send_email","Email sent : "+ info.response)
               }
            });

         const row = new ActionRowBuilder()
         .addComponents(
               new ButtonBuilder()
                     .setCustomId('code_email?'+email)
                     .setLabel('Code de vérification :')
                     .setStyle(ButtonStyle.Primary)
         )
         interaction.reply({components: [row], ephemeral: true})

      } catch (error) {
         if(interaction)
            logs.error(interaction.guild,interaction.user,"send_email",error)
         else
            logs.error(null,null,"send_email",error)
      }
   }
};