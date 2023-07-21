const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const teams = require('../../Interactables/Inscription/temp_teams.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("get_temp_teams")
		.setDescription("Affiche les équipes en cours d'inscription.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error get_temp_teams : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"get_temp_teams",null)
			message = ""
			if(!Object.keys(teams).length){
				message = "Aucune équipe n'est en cours d'inscription"
			} else {
				for (const [key, value] of Object.entries(teams)) {
					message += key + " : "
					for (const [key2, _] of Object.entries(value)) {
						message += "<@"+key2+"> "
					}
					message += "\n"
				  }
			}
            await interaction.reply({content: message, ephemeral: false});

		}
}