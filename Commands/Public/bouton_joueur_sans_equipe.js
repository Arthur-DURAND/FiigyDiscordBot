const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bouton_joueur_sans_equipe")
		.setDescription("Creation d'un bouton pour les équipes incomplètes")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : bouton_joueur_sans_equipe.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"bouton_joueur_sans_equipe","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"bouton_joueur_sans_equipe",null)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('joueur_sans_equipe')
                        .setLabel("Clique ici")
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ content: "", components: [row] })
			interaction.reply({content: "Button created!", ephemeral: true})
			
		}
}