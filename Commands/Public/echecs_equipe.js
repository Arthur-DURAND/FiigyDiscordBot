const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const RoleUtil = require("../../Utils/RoleUtil.js");
const Chess = require('../../Games/chess.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName("echecs_equipe")
		.setDescription("Commandes liées aux échecs en équipe")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand  => subcommand 
			.setName("lancer")
			.setDescription("Lance une partie d'échecs en équipe dans le channel courant.")
            .addIntegerOption(option =>
                option.setName('delai_debut')
                    .setDescription('Délai avant le début de la partie, en heures.')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('duree_vote')
                    .setDescription('Durée pour voter pour un coup, en heures')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('pourcentage_vote')
                    .setDescription('Pourcentage de votes avant de réduire le temps restant pour voter')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('extra_duree_vote')
                    .setDescription('Temps restant après le pourcentage de vote atteint')
                    .setRequired(true))),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
        
		async execute(interaction) {

            try {
                if(!interaction.guild)
                    console.log("Error registration : echecs_equipe.guild is null")

                if(!interaction.channel)
                    logs.error(interaction.guild,interaction.user,"echecs_equipe","interaction.channel is null")

                logs.debug(interaction.guild,interaction.user,"echecs_equipe",null)

                if (interaction.options.getSubcommand() === "lancer") {
                    // Creation roles
                    const roleTeam1 = await interaction.guild.roles.create({
                        name: '♟️┃Echecs equipes - Equipe 1',
                        color: "Blue",
                    })
                    const roleTeam2 = await interaction.guild.roles.create({
                        name: '♟️┃Echecs equipes - Equipe 2',
                        color: "Red",
                    })
                    
                    // Creation channels
                    const channelTeam1 = await interaction.guild.channels.create({
                        name: "Equipe 1",
                        type: ChannelType.GuildText,
                        parent: interaction.channel.parentId,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: process.env.CHESS_ROLE_ID,
                                deny: [PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: roleTeam1.id,
                                allow: [PermissionFlagsBits.ViewChannel]
                            },
                         ],
                    });
                    const channelTeam2 = await interaction.guild.channels.create({
                        name: "Equipe 2",
                        type: ChannelType.GuildText,
                        parent: interaction.channel.parentId,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: process.env.CHESS_ROLE_ID,
                                deny: [PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: roleTeam2.id,
                                allow: [PermissionFlagsBits.ViewChannel]
                            },
                         ],
                    });

                    // Stockage en bdd
                    const start_timestamp = Math.round(Date.now()/1000) + 60*60*interaction.options.getInteger('delai_debut')
                    interaction.client.sequelize.models.singleton.update({value: roleTeam1.id}, {where: {name:"TEAM_CHESS_ROLE_ID_TEAM_1"}})
                    interaction.client.sequelize.models.singleton.update({value: roleTeam2.id}, {where: {name:"TEAM_CHESS_ROLE_ID_TEAM_2"}})
                    interaction.client.sequelize.models.singleton.update({value: channelTeam1.id}, {where: {name:"TEAM_CHESS_CHANNEL_ID_TEAM_1"}})
                    interaction.client.sequelize.models.singleton.update({value: channelTeam2.id}, {where: {name:"TEAM_CHESS_CHANNEL_ID_TEAM_2"}})
                    interaction.client.sequelize.models.singleton.update({value: interaction.options.getInteger('duree_vote')}, {where: {name:"TEAM_CHESS_VOTE_LENGTH"}})
                    interaction.client.sequelize.models.singleton.update({value: interaction.options.getInteger('pourcentage_vote')}, {where: {name:"TEAM_CHESS_VOTE_PERCENTAGE"}})
                    interaction.client.sequelize.models.singleton.update({value: start_timestamp}, {where: {name:"TEAM_CHESS_NEXT_DATE"}})
                    interaction.client.sequelize.models.singleton.update({value: interaction.options.getInteger('extra_duree_vote')}, {where: {name:"TEAM_CHESS_EXTRA_VOTE_LENGTH"}})
                    interaction.client.sequelize.models.singleton.update({value: null}, {where: {name:"TEAM_CHESS_CURRENT_TEAM"}})
                    interaction.client.sequelize.models.singleton.update({value: interaction.channel.id}, {where: {name:"TEAM_CHESS_MAIN_CHANNEL_ID"}})
                    // Clear table TeamChessMembers
                    await interaction.client.sequelize.models.team_chess_members.truncate();
                    // Embed
                    const announcementTeamChess = new EmbedBuilder()
						.setColor("#56203d")
						.setTitle("Une partie d'échecs en équipe est sur le point d'être lancée !")

                    announcementTeamChess.addFields({
                        name:"Clique sur le bouton ci-dessous pour participer !",
                        value:"Tu as jusqu'au <t:"+start_timestamp+":F> pour rejoindre une équipe. Passé ce délai, tu devras attendre la prochaine partie !"
                    })

                    announcementTeamChess.addFields({
                        name:"C'est quoi au juste ?",
                        value:"Les personnes cliquant sur le bouton seront réparties en deux équipes (1 & 2). A chaque tour de jeu, les membres de l'équipe dont c'est le tour voterons pour un coup à jouer. Le reste est une partie d'échecs classique !"
                    })

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('echecs_equipe_btn_participer')
                                .setLabel("Je participe !")
                                .setStyle(ButtonStyle.Primary),
                    );

                    Chess.startSetTimout(interaction.client)

                    interaction.channel.send({content: "", embeds:[announcementTeamChess], components:[row]})
                    interaction.reply({content: "Partie lancée !", ephemeral: true})
                } else {
                    await interaction.reply({content: "Unknown subcommand.", ephemeral: true})
                }                
            } catch (error) {
                if(interaction)
				logs.error(interaction.guild,interaction.user,"echecs_equipe",error)
			else
				logs.error(null,null,"echecs_equipe",error)
            }
			
		}
}