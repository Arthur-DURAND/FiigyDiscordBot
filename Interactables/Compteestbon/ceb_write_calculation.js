
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');

module.exports = {
	name: "ceb_write_calculation",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"ceb_write_calculation",null)

            const [_, ...params] = interaction.customId.split("?")
            if(params.length < 1){
                logs.error(interaction.guild,interaction.user,"ceb_write_calculation","No params")
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
                return
            } else {
                if(params[0] !== interaction.user.id){
                    await interaction.reply({content: "Cette partie a été démarrée par quelqu'un d'autre !", ephemeral: true})
                    return
                }
            }

            const modal = new ModalBuilder()
			.setCustomId('ceb_play')
			.setTitle("Le compte est bon")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('calculation')
                            .setLabel("Calcul :")
                            .setStyle(TextInputStyle.Short)
                    ),
            )

            await interaction.showModal(modal);
        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"ceb_write_calculation",error)
			else
				logs.error(null,null,"ceb_write_calculation",error)
		}
    }
};