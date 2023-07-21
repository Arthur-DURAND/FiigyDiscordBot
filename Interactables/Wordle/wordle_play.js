
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const WinRoles = require('../GameUtils/WinRoles.js');
const wordle_games = require('./temp_wordle.js')
const WORDS = require("./words.js");


module.exports = {
	name: "wordle_play",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"wordle_play",null)

            let user_word = null
            if(interaction.fields)
                user_word = interaction.fields.getTextInputValue('word').toUpperCase();

            if(user_word.length != 5){
                await interaction.reply({content: "Le mot doit avoir 5 lettres !", ephemeral: true})
                return
            }

            if(!WORDS.includes(user_word.toLowerCase())){
                await interaction.reply({content: "Ce mot n'est pas dans le dictionnaire de wordle. Le mot à chercher est en anglais !", ephemeral: true})
                return
            }

            if(!wordle_games[interaction.user.id]){
                await interaction.reply({content: "Cette partie a déjà été terminée.", ephemeral: true})
                return
            }

            const word = wordle_games[interaction.user.id]["word"].toUpperCase();
            const attempts = wordle_games[interaction.user.id]["attemps"]
            attempts.push(user_word)

            let description = "**A** signifie qu'il y a un A à cette place.\n__A__ signifie qu'il y a un A à une autre place.\nA signifie qu'il n'y a pas de A dans le mot.\n\n"
            for(let i=0 ; i< attempts.length ; i++){
                let attempt = attempts[i];
                let previous = 0
                for (let j = 0; j < attempt.length; j++) {
                    if(word.charAt(j) === attempt.charAt(j)){
                        if(previous != 1) {
                            if(previous == 2){
                                description += "__"
                            }
                            description += "**"
                            previous = 1;
                        }
                        description += attempt.charAt(j)
                    } else if(word.includes(attempt.charAt(j))){
                        if(previous != 2) {
                            if(previous == 1){
                                description += "**"
                            }
                            description += "__"
                            previous = 2;
                        }
                        description += attempt.charAt(j)
                    } else {
                        if(previous == 1){
                            description += "**"
                        } else if(previous == 2){
                            description += "__"
                        }
                        previous = 0;
                        description += attempt.charAt(j)
                    }
                }
                if(previous == 1){
                    description += "**"
                } else if(previous == 2){
                    description += "__"
                }
                description += "\n";
            }
            for(let i=attempts.length ; i<6 ; i++){
                description += "\\_ \\_ \\_ \\_ \\_\n";
            }

            let game_ended = false
            if(word === attempts[attempts.length-1]){
                description += "\nFélicitations !"
                game_ended = true

                // get data from channel
                const channel = interaction.guild.channels.cache.get(process.env.WORDLE_DATA_CHANNEL_ID)
                const first_place_role = await interaction.guild.roles.fetch(process.env.WORDLE_FIRST_PLACE_ROLE_ID)
                const second_place_role = await interaction.guild.roles.fetch(process.env.WORDLE_SECOND_PLACE_ROLE_ID)
                const third_place_role = await interaction.guild.roles.fetch(process.env.WORDLE_THIRD_PLACE_ROLE_ID)
                let wordle_roles = [first_place_role,second_place_role,third_place_role]
                WinRoles.updateRoles(interaction.guild, channel, interaction.user, wordle_roles, "Wordle")
   
            } else if(attempts.length == 6){
                description += "\nPartie finie !\nLe mot était : "+word
                game_ended = true
            }

			const footer = "/wordle pour démarrer une autre partie"

			let hexAccentColor = (await interaction.user.fetch(true)).hexAccentColor
			if(!hexAccentColor){
				hexAccentColor = process.env.EMBED_COLOR
			}

			const embed = new EmbedBuilder()
                .setColor(hexAccentColor)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTitle("Wordle")
                .setDescription(description)
				.setFooter({ text: footer})

            if(game_ended) {
                delete wordle_games[interaction.user.id]
                await interaction.update({embeds: [embed], components: []})
            } else {
                await interaction.update({embeds: [embed]})
            }
            
            
        } catch (error) {
			if(interaction) {
				logs.error(interaction.guild,interaction.user,"wordle_play",error)
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
            } else {
				logs.error(null,null,"wordle_play",error)
            }
		}
    }
};