const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = {
    get_modal: function () {
        const modal = new ModalBuilder()
        .setTitle('Inscription équipe incomplète')
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('pseudo')
                        .setLabel("Pseudo sur "+process.env.TOURNAMENT_GAME_NAME)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('discord')
                    .setLabel("Pseudo/Id discord")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('rang')
                    .setLabel("Rang (si applicable)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        )

        if(process.env.TOURNAMENT_TEAM_SIZE > 2){
            modal.addComponents(new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('allies')
                        .setLabel("Pseudo discord de tes alliés (si tu en as)")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )
            )
        }

        modal.addComponents(new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('commentaire')
                    .setLabel("Commentaire")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
            )
        )
        return modal
    },
  };