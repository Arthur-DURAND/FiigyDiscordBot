const { EmbedBuilder, userMention, channelMention, ChannelType, PermissionsBitField } = require('discord.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');
require('dotenv').config();

module.exports = {
	name: "create_game_builder",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"create_game_builder",null)

        const guild = interaction.guild
        const gameName = interaction.fields.getTextInputValue('gameName');
        const prefix = process.env.COMMU_PREFIX

        const gameList = await RoleUtil.getRoleListFromString(guild, prefix)
        if (gameList.length > process.env.NB_COMMUNITIES) {

            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("⚠️ Erreur")
                .setDescription("Trop de communautés créées, contactez un administrateur")

            await interaction.update({ embeds: [embed] , ephemeral: true, components: [] });
            return
        } else {

        const existingRole = await interaction.guild.roles.cache.find(role => role.name === prefix + gameName)
        if (existingRole != null) {

            const embed = new EmbedBuilder()
                .setColor(process.env.EMBED_COLOR)
                .setTitle("⚠️ Erreur")
                .setDescription("La Communauté " + gameName + " existe déjà")

            await interaction.update({ embeds: [embed] , ephemeral: true, components: [] });
            return
        } else {
            
        await guild.roles.create({
            name: prefix + gameName,
            color: process.env.COMMU_ROLE_COLOR
        })
        .then(async (role) => {
        
        const member = await guild.members.fetch(interaction.member.id)
        member.roles.add(role)

        await guild.channels.create({
            name: process.env.COMMU_CHANNEL_PREFIX + gameName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        })
        .then(async (channel) => {
        
        channel.setParent(process.env.COMMUNITY_CAT_ID)
        channel.setPosition(1)

        channel.permissionOverwrites.set([
            {
                id: role.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: channel.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
        ],);
        
        const embed = new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setTitle('Bienvenue sur la communauté ' + gameName)
            .setDescription("Créée par " + userMention(member.id) + ".\nBon Jeu !")
        
        channel.send({ embeds: [embed]})

        const embed2 = new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setTitle("Créer une nouvelle communauté")
            .setDescription("Communauté crée: " + channelMention(channel.id))
        
        await interaction.update({ embeds: [embed2], ephemeral: true, components: []});
            })
        }) 
        }}  
	}
};