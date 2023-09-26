
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "inscription_decline_modal",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_decline_modal",null)

            // Get team id
            // Get all ids
            // Get all members
            // DMs everyone
            // delete members + team
        
            await interaction.reply("Pas implémenté :) (Mais pas vraiment utile de toute manière)");

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_validation_modal",error)
			else
				logs.error(null,null,"inscription_validation_modal",error)
		}
    
    }
};