const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("whitelist")
		.setDescription("Envoie un bouton permettant d'etre whitelist sur le serveur Minecraft.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			if(!interaction.guild)
				console.log("Error whitelist : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"whitelist","interaction.channel is null")

			logs.debug(interaction.guild,interaction.user,"whitelist",null)

			const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('whitelist_modal')
							.setLabel('Clique ici pour être whitelisted !')
							.setStyle(ButtonStyle.Primary)
				)


				const text = `Clique sur le bouton ci-dessous pour être whitelist sur le serveur Minecraft ! Mais avant ça, n'oublie pas de vérifier ton adresse email INSA.`
	
				const embed = new EmbedBuilder()
					.setColor(process.env.EMBED_COLOR)
					.setTitle("Rejoindre le serveur Minecraft")
					.setDescription(text)
	
			if(interaction.channel)
				interaction.channel.send({ embeds: [embed], components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})


		}
}