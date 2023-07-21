const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("whitelist_complete")
		.setDescription("Envoie des boutons permettant d'etre whitelist sur le serveur Minecraft.")
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
							.setCustomId('ask_email')
							.setLabel('Vérifier son email')
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId('whitelist_modal')
							.setLabel('Se whitelist')
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('whitelist_friend_modal')
							.setLabel('Whitelist ton +1')
							.setStyle(ButtonStyle.Danger)
				)


				const text = `Accède au serveur en 3 étapes:
				- ✅  Vérifie ton adresse INSA
				- <:minecraft:761889148700459058> Ajoute ton pseudo
				- <:plusone:1021941249508393031> Ajoute ton +1, qui soit de l'INSA ou non
				Tu es alumni ? Envoie une preuve à <@1071198034152669224> et tu auras le rôle alumni !`
	
				const embed = new EmbedBuilder()
					.setColor(process.env.EMBED_COLOR)
					.setTitle("Whitelist du serveur Minecraft !")
					.setDescription(text)
	
			if(interaction.channel)
				interaction.channel.send({ embeds: [embed], components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})


		}
}