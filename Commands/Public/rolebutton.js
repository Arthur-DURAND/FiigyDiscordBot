const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rolebutton")
		.setDescription("Créer un bouton auquel est associé un rôle")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle qui sera donné')
                .setRequired(true)),

        /**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		execute(interaction) {

            if(!interaction.guild)
				console.log("Error rolebutton : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"rolebutton","interaction.channel is null")

            if(!interaction.options)
                logs.error(interaction.guild,interaction.user,"rolebutton","interaction.options is null")

            logs.debug(interaction.guild,interaction.user,"rolebutton",null)


            const role = interaction.options.getRole('role');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('give_take_roles?'+ role.name)
                        .setLabel('Ajouter/Retirer: ' + role.name)
                        .setStyle(ButtonStyle.Primary),
			);
            interaction.channel.send({ components: [row] })
			interaction.reply({content: "Button Role Créé!", ephemeral: true})

		}
}