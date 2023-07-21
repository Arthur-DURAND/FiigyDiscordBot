const { EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "newsletter_register",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"newsletter_register",null)

        try {
            // regex email
            var email_regex = new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}");
            if(!email_regex.test(email)){
            interaction.reply({content: "Cet email n'est pas valide ! Il faut ton adresse email INSA. Si tu penses que c'est une erreur, contacte un admin.", ephemeral: true})
            return
            }

            let email_perso = interaction.fields.getTextInputValue('email_perso');
            email_perso = email_perso.replace(/\s+/g, '');

            user = await interaction.client.sequelize.models.user.findOne({ where: { discord_id: interaction.member.id } })
            if (user) {
                await user.update({email_perso: email_perso})
            } else {
                await interaction.client.sequelize.models.user.create({
                    discord_id: interaction.member.id,
                    email_perso: email_perso
                })
            }

            
            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("Newsletter de la FIIG")
                .setDescription("Inscription réussie pour: " + email_perso)
            
            await interaction.reply({ embeds: [embed], ephemeral: true, components: []})

        } catch (error) {
            await interaction.reply({ content: "Tout cassé", ephemeral: true, components: []})
        }
	}
};