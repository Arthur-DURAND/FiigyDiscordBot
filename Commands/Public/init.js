const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("init")
		.setDescription("Init bot")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
			options
				.setName("all")
				.setDescription("Init bot")),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		execute(interaction) {

			if(!interaction.guild)
				console.log("Error init : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"init","interaction.channel is null")

			logs.debug(interaction.guild,interaction.user,"init",null)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('init_all')
                        .setLabel('Click !')
                        .setStyle(ButtonStyle.Primary)
			)
            interaction.channel.send({ components: [row] })
			interaction.reply({content: "Done!", ephemeral: true})

		}
}