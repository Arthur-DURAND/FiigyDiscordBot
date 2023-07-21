const { ButtonStyle, ButtonBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const teams = require('../../Interactables/Inscription/temp_teams.js')

let command = new SlashCommandBuilder()
                .setName("inscription")
                .setDescription("Inscription d'une équipe au tournoi en cours : "+process.env.TOURNAMENT_NAME)
                .setDefaultMemberPermissions(process.env.TOURNAMENT_TEAM_SIZE > 1 ? PermissionFlagsBits.SendMessages:PermissionFlagsBits.Administrator)
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

            if (!interaction.isChatInputCommand()) return;

            if(!interaction.guild){
                interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                return
            }

            if(interaction.guild.id !== process.env.TOURNAMENT_GUILD_ID){
                interaction.reply({content: "La commande a été executée sur le mauvais serveur.", ephemeral: true})
                return
            }

			logs.debug(interaction.guild,interaction.user,"inscription",null)

            const team_name = interaction.options.getString('team_name');

            if(teams[team_name]){
                interaction.reply({content: "Une équipe au nom de "+team_name+" existe déjà !"})
                return
            }

            if(!interaction.user){
                interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                return
            }
            
            // Get GuildMembers
            const author = await interaction.guild.members.fetch(interaction.user)
            let member_list = [author]
            let member_id_list = [interaction.user.id]
            for(let i=1 ; i<process.env.TOURNAMENT_TEAM_SIZE ; i++){
                const user = interaction.options.getUser('player'+i)
                if(!user){
                    interaction.reply({content: "Une erreur s'est produite avec l'utilisateur "+i+" ! ", ephemeral: true})
                    return
                }
                const member = await interaction.guild.members.fetch(user)
                member_list.push(member)

                // Check no dup
                if(member_id_list.includes(user.id)){
                    interaction.reply({content: "L'utilisateur "+i+" a été tag deux fois ! (Rappel : pas besoin de se tag soit-même)", ephemeral: true})
                    return
                }
                member_id_list.push(user.id)
            }

            // Get role
            const role = await interaction.guild.roles.cache.find(role => role.name === process.env.CONTENDER_ROLE)
            if (!role) {
                logs.error(interaction.guild,interaction.user,"inscription","Role not found: " + process.env.CONTENDER_ROLE)
                interaction.reply({content: "Une erreur s'est produite. Réessaye !", ephemeral: true})
                return
            }

            // Get username for reply
            let username_str = ""
            // Check if not already registered or if bot
            let team = {}
            for(member of member_list){
                if(member.roles.cache.has(role.id)){
                    interaction.reply({content: "L'utilisateur "+member.user.username+" est déjà inscrit à ce tournoi !", ephemeral: true})
                    return
                }
                if(member.user.bot){
                    interaction.reply({content: "L'utilisateur "+member.user.username+" est un bot ! Il ne peut pas particper à un tournoi :)", ephemeral: true})
                    return
                }
                username_str = username_str + member.user.username+"#"+member.user.discriminator + " ; "
                team[member.user.id] = {username:member.user.username+"#"+member.user.discriminator,id:null}
            }

            let message = "Equipe en cours d'inscription : "
            for(member of member_list){
                message += "<@"+member.user.id+"> "
            }
            logs.info(interaction.guild,interaction.user,"inscription",message)

            // Add team
            teams[team_name] = team

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('inscription_validation_modal?'+ team_name)
                        .setLabel("J'accepte !")
                        .setStyle(ButtonStyle.Primary),
			);

            // send dm
            for(member of member_list){
                member.user.send({content: "Bonjour,\nTu as été invité à participer au tournoi du GIT sur "+process.env.TOURNAMENT_NAME+" en équipe de "+process.env.TOURNAMENT_TEAM_SIZE+". L'équipe dans laquelle tu es invité s'appelle "+team_name+" et est composé de : "+username_str, components: [row]})
            }

            interaction.reply({content: "Première étape de l'inscription réussite ! Maintenant, chaque membre de l'équipe doit répondre au bot dans ses messages privés. L'équipe s'appelle "+team_name+" et est composé de : "+username_str, ephemeral: true})
		}
}