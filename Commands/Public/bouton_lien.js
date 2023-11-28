const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bouton_lien")
		.setDescription("Creation d'un bouton donnant un lien vers un formulaire")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('lien_vérifié')
                .setDescription('Le message affiché sur le bouton.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('lien_alumni')
                .setDescription('Le message affiché sur le bouton.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('lien_others')
                .setDescription('Le message affiché sur le bouton.')
                .setRequired(false)),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            try {
                if(!interaction.guild)
                    console.log("Error registration : bouton_lien.guild is null")

                if(!interaction.channel)
                    logs.error(interaction.guild,interaction.user,"bouton_lien","interaction.channel is null")

                logs.debug(interaction.guild,interaction.user,"bouton_lien",null)

                const lien_verifie = interaction.options.getString('lien_vérifié');
                const lien_alumni = interaction.options.getString('lien_alumni');
                const lien_others = interaction.options.getString('lien_others');

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('lien?'+lien_verifie+"?"+lien_alumni+"?"+lien_others)
                            .setLabel("Clique pour obtenir le lien")
                            .setStyle(ButtonStyle.Primary),
                );
                interaction.channel.send({ content: "", components: [row] })
                interaction.reply({content: "Button created!", ephemeral: true})
            } catch (error) {
                logs.error(interaction.guild,interaction.user,"bouton_lien",error)
            }
			
		}
}