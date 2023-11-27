const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bouton_lien_formulaire")
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
                .setRequired(true)),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            if(!interaction.guild)
				console.log("Error registration : bouton_lien_formulaire.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"bouton_lien_formulaire","interaction.channel is null")

            logs.debug(interaction.guild,interaction.user,"bouton_lien_formulaire",null)

            const lien_verifie = interaction.options.getString('lien_vérifié');
            const lien_alumni = interaction.options.getString('lien_alumni');
            const lien_others = interaction.options.getString('lien_others');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lien_formulaire?'+lien_verifie+"?"+lien_alumni+"?"+lien_others)
                        .setLabel("Lien vers le formulaire")
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ content: "", components: [row] })
			interaction.reply({content: "Button created!", ephemeral: true})
			
		}
}