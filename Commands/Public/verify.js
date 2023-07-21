const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Verify email")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			if(!interaction.guild)
				console.log("Error verify : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"verify","interaction.channel is null")

			logs.debug(interaction.guild,interaction.user,"verify",null)

			const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('ask_email')
							.setLabel('Clique ici pour vérifier ton email !')
							.setStyle(ButtonStyle.Primary)
				)


				const text = `Vérifie ton email INSA sur le discord afin de pouvoir participer aux événements !\nEn particulier, ça te permettra de :\n🏆 Participer au GIT\n<:minecraft:761889148700459058> Rejoindre le serveur Minecraft\nTu es alumni ? Envoie une preuve à <@288743029030912000> et tu auras le rôle alumni !`
	
				const embed = new EmbedBuilder()
					.setColor(process.env.EMBED_COLOR)
					.setTitle("Vérification d'email")
					.setDescription(text)
	
			if(interaction.channel)
				interaction.channel.send({ embeds: [embed], components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})


		}
}