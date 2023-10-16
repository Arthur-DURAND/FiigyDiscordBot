
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');

module.exports = {
	name: "wordle_choose_word",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"wordle_choose_word",null)

            const modal = new ModalBuilder()
			.setCustomId('wordle_play')
			.setTitle("Wordle")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('word')
                            .setLabel("Mot :")
                            .setStyle(TextInputStyle.Short)
                    ),
            )
            
            await interaction.showModal(modal);
        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"wordle_choose_word",error)
			else
				logs.error(null,null,"wordle_choose_word",error)
		}
    }
};