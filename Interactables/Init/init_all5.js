const { EmbedBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const initUtils = require('./InitUtils.js')
require('dotenv').config();
const data = require('./init_data.js')

module.exports = {
	name: "init_all5",
	async execute(interaction) {

        try {

            initUtils.checkInteraction(interaction,"init_all5")
            if(!interaction)
                return

            logs.debug(interaction.guild,interaction.user,"init_all5",null)

            initUtils.fillMemberRole(interaction,"init_all5",process.env.MINECRAFT_PREFIX)

            if(!interaction.member.id){
                logs.error(interaction.guild, null, file_name, "Interaction.member.id is null")
                return
            }

            const member = await interaction.guild.members.fetch(interaction.member.id)
            let member_roles = data[interaction.member.id]
            member_roles = [...new Set(member_roles)]
            try{
                await member.roles.set(member_roles)
            } catch (error) {
                logs.error(interaction.guild, interaction.user, "init_all5", error)
            }
            delete data[interaction.member.id]

            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("Attribution des rôles")
                .setDescription(":arrow_forward: Terminée 👋")

            await interaction.update({ embeds: [embed], ephemeral: true , components: [] });

            logs.info(interaction.guild,interaction.user,"init_all5","Roles given")

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"init_all5",error)
			else
				logs.error(null,null,"init_all5",error)
		}
	},
};