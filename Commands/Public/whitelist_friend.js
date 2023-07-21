const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("whitelist_friend")
		.setDescription("Envoie un bouton permettant de whitelist un ami sur le serveur Minecraft.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			if(!interaction.guild)
				console.log("Error whitelist_friend : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"whitelist_friend","interaction.channel is null")

			logs.debug(interaction.guild,interaction.user,"whitelist_friend",null)

			const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('whitelist_friend_modal')
							.setLabel('Clique ici pour whitelist un ami !')
							.setStyle(ButtonStyle.Primary)
				)

				const text = `Clique sur le bouton ci-dessous pour pouvoir whitelist un ami sur le serveur Minecraft ! Mais avant ça, n'oublie pas de vérifier ton adresse email INSA.`
	
				const embed = new EmbedBuilder()
					.setColor(process.env.EMBED_COLOR)
					.setTitle("Inviter un ami sur le serveur Minecraft")
					.setDescription(text)
	
			if(interaction.channel)
				interaction.channel.send({ embeds: [embed], components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})


		}
}