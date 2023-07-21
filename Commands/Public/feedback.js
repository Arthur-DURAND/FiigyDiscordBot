const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("feedback")
		.setDescription("Demander un feedback")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message qui précède le bouton feedback')
                .setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Le channel de log des feedbacks')),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		execute(interaction) {

			if(!interaction.guild)
				console.log("Error feedback : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"feedback","interaction.channel is null")

			if(!interaction.options)
                logs.error(interaction.guild,interaction.user,"feedback","interaction.options is null")

			logs.debug(interaction.guild,interaction.user,"feedback",null)

			let message = interaction.options.getString('message');

			message = message.replace(/(\\n|\\r|\\r\\n)/gm,"\n")

			const channel = interaction.options.getChannel('channel');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ask_feedback?'+channel.id)
                        .setLabel('Clique ici !')
                        .setStyle(ButtonStyle.Primary)
			)
            interaction.channel.send({ content: message, components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})

		}
}