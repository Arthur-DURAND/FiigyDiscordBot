
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "inscription_validation_modal",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_validation_modal",null)

            let team_name = null
            if(interaction.customId){
                let params = interaction.customId.split("?")
                if(params.length > 1){
                    team_name = params[1]
                } else {
                    logs.error(interaction.guild, interaction.user, "inscription_validation_modal", "No team_name found in customId")
                }
            }

            const modal = new ModalBuilder()
            .setCustomId('inscription_confirm?'+team_name)
            .setTitle('Entre ton identifiant sur '+process.env.TOURNAMENT_NAME+".")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('identifiant')
                            .setLabel("Ton identifiant : (pseudo, id...)")
                            .setStyle(TextInputStyle.Short)
                    )
            )
        
            await interaction.showModal(modal);

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_validation_modal",error)
			else
				logs.error(null,null,"inscription_validation_modal",error)
		}
    
    }
};