const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("button_hidden")
		.setDescription("Creation d'un bouton permettant d'obtenir un message")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
            option.setName('display')
                .setDescription('Le message affiché sur le bouton.')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('hidden')
				.setDescription('Le message caché à donner.')
				.setRequired(true)),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : button_hidden.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"button_hidden","interaction.channel is null")

			if(!interaction.options)
                logs.error(interaction.guild,interaction.user,"button_hidden","interaction.options is null")

            logs.debug(interaction.guild,interaction.user,"button_hidden",null)

			// args
			let display = interaction.options.getString('display');
			let hidden = interaction.options.getString('hidden');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('button_hidden_content?'+hidden)
                        .setLabel(display)
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ content: "", components: [row] })
			interaction.reply({content: "Button created!", ephemeral: true})
			
		}
}