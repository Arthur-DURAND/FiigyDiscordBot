const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("inscription_solo_bouton")
		.setDescription("Creation d'un bouton d'inscription pour un tournoi solo")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : inscription_solo_bouton.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"inscription_solo_bouton","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"inscription_solo_bouton",null)

            const tournament_name = process.env.TOURNAMENT_NAME;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('inscription_solo')
                        .setLabel("Je m'inscris !")
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ content: "Le tournoi " + tournament_name +" t'intéresse ? Clique sur le bouton ci-dessous ! :point_down:", components: [row] })
			interaction.reply({content: "Registration button created!", ephemeral: true})
			
		}
}