const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bouton_lien_chess_com")
		.setDescription("Creation d'un bouton pour récupérer le lien vers le club chess.com")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : bouton_lien_chess_com.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"bouton_lien_chess_com","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"bouton_lien_chess_com",null)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lien_chess_com')
                        .setLabel("Lien du club chess.com")
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ content: "", components: [row] })
			interaction.reply({content: "Button created!", ephemeral: true})
			
		}
}