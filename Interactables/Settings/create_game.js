const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "create_game",
	async execute(interaction) {

		logs.debug(interaction.guild,interaction.user,"create_game",null)

        const embed = new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setTitle('Créer une nouvelle communauté')
            .setDescription("As-tu vérifié qu'il n'existe pas déjà de communauté pour ton jeu ?")

        row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('create_game_modal')
					.setLabel('Confirmer')
					.setStyle(ButtonStyle.Primary)
			);
        
        await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
	},
};