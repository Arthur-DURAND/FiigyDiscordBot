
const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	name: "inscription_solo_pseudo",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"inscription_solo_pseudo",null)
            logs.info(interaction.guild,interaction.user,"inscription_solo_pseudo",null)

            let tournament_name = process.env.TOURNAMENT_NAME

            const member = await interaction.guild.members.fetch(interaction.user)

            const roles = member.roles.cache
            for(let role of roles){
                if(role[0] == process.env.CONTENDER_ROLE_ID){
                    if(interaction.channel){
                        await interaction.reply({ content: "Tu es déjà inscrit ! DM <@288743029030912000> si tu souhaites te désinscrire.", ephemeral: true })
                        return
                    }
                }
            }

            const modal = new ModalBuilder()
			.setCustomId('inscription_solo')
			.setTitle("Inscription au tournoi "+tournament_name)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('pseudo')
                            .setLabel("Pseudo sur chess.com :")
                            .setStyle(TextInputStyle.Short)
                    )
            )

            await interaction.showModal(modal);

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"inscription_solo",error)
			else
				logs.error(null,null,"inscription_solo",error)
		}
    
    }
};