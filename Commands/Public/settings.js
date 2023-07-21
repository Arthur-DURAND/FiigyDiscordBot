const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Create a role selector")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
			options
				.setName("all")
				.setDescription("Create a role selector")),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		execute(interaction) {

            if(!interaction.guild)
				console.log("Error settings : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"settings","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"settings",null)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settings_notification')
                        .setLabel('Notifications')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("🔉"),
                    new ButtonBuilder()
                        .setCustomId('settings_minecraft')
                        .setLabel('Minecraft')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji({
                            "id": "761889148700459058",
                            "name": "minecraft"
                            }),
                    new ButtonBuilder()
                        .setCustomId('settings_games')
                        .setLabel('Communautaire')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("🎮"),
                    new ButtonBuilder()
                        .setCustomId('create_game')
                        .setLabel('‎')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("🆕"),
                    new ButtonBuilder()
                        .setCustomId('newsletter_modal')
                        .setLabel('Newsletter')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("📰"))

            const text = `Choisissez les rôles qui vous correspondent:
            🔉┃ Personnalisez vos notifications
            <:minecraft:761889148700459058>┃ Rejoignez le serveur Minecraft
            🎮┃ Trouvez des communautés de jeu
            🆕┃ Ou créez la votre !
            📰┃ Inscris toi à la newsletter FIIG (/unsuscribe pour se désabonner)`

            const text2 = `Pour retirer des rôles existants, sélectionnez 'Pas intéressé' dans les différentes catégories.`

            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("Gestionnaire de rôles")
                .setDescription(text)
                .addFields(
                    { name: '\u200B',value: text2 })

            interaction.channel.send({ embeds: [embed], components: [row] })
            interaction.reply({content: "Done!", ephemeral: true})
		}
}