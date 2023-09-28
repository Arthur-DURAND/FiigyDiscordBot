const { ButtonStyle, ButtonBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const { Op, Transaction } = require('sequelize')

let command = new SlashCommandBuilder()
                .setName("inscription")
                .setDescription("Inscription d'une équipe au tournoi en cours : "+process.env.TOURNAMENT_NAME)
                .setDefaultMemberPermissions(process.env.TOURNAMENT_TEAM_SIZE > 1 ? PermissionFlagsBits.SendMessages : PermissionFlagsBits.Administrator)
                .addStringOption(option => option.setName('team_name').setRequired(true).setDescription('Nom de l\'équipe'))
for(let i=1 ; i<process.env.TOURNAMENT_TEAM_SIZE ; i++){
    command.addUserOption(option => option.setName('player'+i).setRequired(true).setDescription('Tag de ton allié '+i))
}

module.exports = {
	data: command,
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

            const t = await interaction.client.sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
            })

            try {

                if (!interaction.isChatInputCommand()) {
                    await t.rollback();
                    return
                }

                if(!interaction.guild){
                    await t.rollback();
                    interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                    return
                }

                logs.debug(interaction.guild,interaction.user,"inscription",null)

                const team_name = interaction.options.getString('team_name');

                // Check if team name already exists
                const check_team = await interaction.client.sequelize.models.team.findOne({ where: { name: team_name}, transaction: t })
                if (check_team) {
                    await t.rollback();
                    interaction.reply({content: "Une équipe au nom `"+team_name+"` existe déjà !", ephemeral: true})
                    return
                }

                // Get role contender
                const role = interaction.guild.roles.cache.find(role => role.name === process.env.CONTENDER_ROLE)
                if (!role) {
                    await t.rollback();
                    logs.error(interaction.guild,interaction.user,"inscription","Role not found: " + process.env.CONTENDER_ROLE)
                    interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                    return
                }
                
                // Get GuildMembers
                if(!interaction.user){
                    await t.rollback();
                    interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                    return
                }
                const author = await interaction.guild.members.fetch(interaction.user)
                let member_id_list = [interaction.user.id]
                let member_list = [author]
                let username_str = interaction.user.displayName
                let teamAlumni = false
                /*let check_player = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {discord_id: interaction.user.id, ready: true}} })
                if(check_player){
                    interaction.reply({content: "L'utilisateur <@"+interaction.user.id+"> est déjà inscrit dans une équipe !", ephemeral: true})
                    return
                }*/
                let check_team_member = await interaction.client.sequelize.models.team_member.findAll({ where: { [Op.and]: {discord_id: interaction.user.id, ready: true }}, transaction: t})
                    for(let team_member of check_team_member){
                        let check_team_ready = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {ready: false, team_id: team_member.team_id}}, transaction: t})
                        if(!check_team_ready){
                            await t.rollback();
                            interaction.reply({content: "L'utilisateur <@"+interaction.user.id+"> est déjà inscrit dans une équipe !", ephemeral: true})
                            return
                        }
                    }
                // Check if already accepted another team
                if(!await isMemberFreeAgent(interaction, t, author)){
                    await t.rollback();
                    interaction.reply({content: "L'utilisateur <@"+interaction.user.id+"> est déjà inscrit dans une équipe !", ephemeral: true})
                    return
                }

                let alumni = await isMemberAlumni(author)

                if(alumni){
                    teamAlumni = true
                }

                if(!alumni && !await isMemberVerified(author)){
                    await t.rollback();
                    interaction.reply({content: "L'utilisateur <@"+interaction.user.id+"> n'a pas vérifié son email !", ephemeral: true})
                    return
                }
                

                for(let i=1 ; i<process.env.TOURNAMENT_TEAM_SIZE ; i++){
                    const user = interaction.options.getUser('player'+i)
                    if(!user){ 
                        await t.rollback()
                        interaction.reply({content: "Une erreur s'est produite avec l'utilisateur "+i+" ! ", ephemeral: true})
                        return
                    }
                    const member = await interaction.guild.members.fetch(user)
                    member_list.push(member)

                    // Check no dup
                    if(member_id_list.includes(user.id)){
                        await t.rollback()
                        interaction.reply({content: "L'utilisateur "+i+" a été tag deux fois ! (Rappel : pas besoin de se tag soit-même)", ephemeral: true})
                        return
                    }
                    member_id_list.push(user.id)

                    // Check no bot
                    if(user.bot){
                        await t.rollback()
                        interaction.reply({content: "L'utilisateur <@"+user.id+"> est un bot ! Il ne peut pas particper à un tournoi :)", ephemeral: true})
                        return
                    }

                    // Check if already accepted another team
                    if(!await isMemberFreeAgent(interaction, t, member)){
                        await t.rollback()
                        interaction.reply({content: "L'utilisateur <@"+user.id+"> est déjà inscrit dans une équipe !", ephemeral: true})
                        return
                    }

                    alumni = await isMemberAlumni(member)
                    if(alumni){
                        teamAlumni = true
                    }

                    if(!alumni && !await isMemberVerified(member)){
                        await t.rollback()
                        interaction.reply({content: "L'utilisateur <@"+user.id+"> n'a pas vérifié son email !", ephemeral: true})
                        return
                    }

                    username_str = username_str + " ; " + user.displayName
                }
                const team = await interaction.client.sequelize.models.team.create({
                    name: team_name
                }, {transaction: t})
                
                for(let i=0 ; i<member_id_list.length ; i++){
                    await interaction.client.sequelize.models.team_member.create({
                        discord_id: member_id_list[i],
                        team_id: team.id,
                        ready: false
                    }, { transaction: t })
                }

                let message = "Equipe en cours d'inscription : "
                for(member of member_list){
                    message += "<@"+member.user.id+"> "
                }
                logs.info(interaction.guild,interaction.user,"inscription",message)

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('inscription_validation_modal?'+ team_name)
                            .setLabel("J'accepte !")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('inscription_decline?'+ team_name)
                            .setLabel("Refuser")
                            .setStyle(ButtonStyle.Secondary),
                );

                // send dm
                for(member of member_list){
                    member.user.send({content: "Bonjour,\nTu as été invité à participer au tournoi du GIT sur "+process.env.TOURNAMENT_NAME+" en équipe de "+process.env.TOURNAMENT_TEAM_SIZE+". L'équipe dans laquelle tu es invité s'appelle `"+team_name+"` et est composée de : "+username_str+ (teamAlumni?"\n**Il s'agit d'une équipe alumni !**":""), components: [row]})
                }

                await t.commit();

                interaction.reply({content: "Première étape de l'inscription réussite ! Maintenant, chaque membre de l'équipe doit répondre au bot dans ses messages privés. L'équipe s'appelle `"+team_name+"` et est composée de : "+username_str+ (teamAlumni?"\n**Il s'agit d'une équipe alumni !**":""), ephemeral: true})
		
            } catch (error) {
                console.log("error", error)
                await t.rollback();
                if(interaction)
                    logs.error(interaction.guild,interaction.user,"inscription",error)
                else
                    logs.error(null,null,"inscription",error)
            }
        }
}

async function isMemberFreeAgent(interaction, t, member){
    let check_team_member = await interaction.client.sequelize.models.team_member.findAll({ where: { [Op.and]: {discord_id: member.user.id, ready: true }}, transaction: t})
    for(let team_member of check_team_member){
        let check_team_ready = await interaction.client.sequelize.models.team_member.findOne({ where: { [Op.and]: {ready: false, team_id: team_member.team_id}}, transaction: t})
        if(!check_team_ready){
            return false
        }
    }
    return true
}

async function isMemberVerified(member){
    const roles = member.roles.cache
    for(let role of roles){
        if(role[0] == process.env.VERIFIED_EMAIL_ROLE_ID){
            return true
        }
    }
    return false
}

async function isMemberAlumni(member){
    const roles = member.roles.cache
    for(let role of roles){
        if(role[0] == process.env.ALUMNI_ROLE_ID){
            return true
        }
    }
    return false
}