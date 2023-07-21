const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const wordle_games = require('../../Interactables/Wordle/temp_wordle.js')
const WORDS = require("../../Interactables/Wordle/words.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("wordle")
		.setDescription("Lance une partie de wordle.")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error wordle : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"wordle",null)

			if(interaction.channelId !== process.env.WORDLE_PLAY_CHANNEL_ID){
				await interaction.reply({content: "Ce n'est pas le bon channel pour cette commande !", ephemeral: true})
                return
			}

			let word = WORDS[Math.floor(Math.random() * 2315)] 
			wordle_games[interaction.user.id] = {word:word, attemps:[]}

			const description = "**A** signifie qu'il y a un A à cette place.\n__A__ signifie qu'il y a un A à une autre place.\nA signifie qu'il n'y a pas de A dans le mot.\n\n\\_ \\_ \\_ \\_ \\_\n\\_ \\_ \\_ \\_ \\_\n\\_ \\_ \\_ \\_ \\_\n\\_ \\_ \\_ \\_ \\_\n\\_ \\_ \\_ \\_ \\_\n\\_ \\_ \\_ \\_ \\_\n"
			const footer = "/wordle pour démarrer une autre partie"

			let hexAccentColor = (await interaction.user.fetch(true)).hexAccentColor
			if(!hexAccentColor){
				hexAccentColor = process.env.EMBED_COLOR
			}

			const embed = new EmbedBuilder()
                .setColor(hexAccentColor)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTitle("Wordle")
                .setDescription(description)
				.setFooter({ text: footer})

			const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('wordle_choose_word?'+interaction.user.id)
                        .setLabel('Proposer un mot')
                        .setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
                        .setCustomId('wordle_cancel?'+interaction.user.id)
                        .setLabel('Abandonner')
                        .setStyle(ButtonStyle.Danger),
			);

            interaction.reply({embeds: [embed], components:[row]})

		}
}