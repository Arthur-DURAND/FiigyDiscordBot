const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const { displayTournoi } = require("../../Interactables/Wordle/tournament_display")
const { player_list } = require("../../Interactables/Wordle/player_list_test")
//const { Op, Transaction } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("creation_tournoi")
		.setDescription("Crée un 'arbre' de tournoi en ronde de 16 joueurs")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        /*.addIntegerOption(option =>
			option
				.setName('type_tournoi')
				.setDescription("1 pour rondes suisse")
				.setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('nbr_joueurs')
                .setDescription("Le nombre de participant") //Je fais simple pour l'instant mais il faudrait of crous automatiser en comptant dans la db
                .setRequired(true)),
                */
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			if(!interaction.guild)
				console.log("Error creation_tournoi : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"creation_tournoi","interaction.channel is null")

			logs.debug(interaction.guild,interaction.user,"creation_tournoi",null)

            const displayData = await displayTournoi(player_list)
            await interaction.reply({embeds: displayData, ephemeral:true})

        }


}