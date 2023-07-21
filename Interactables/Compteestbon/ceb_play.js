
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const WinRoles = require('../GameUtils/WinRoles.js');
const ceb_games = require('./temp_ceb.js')


module.exports = {
	name: "ceb_play",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"ceb_play",null)

            let calculation = null
            if(interaction.fields){
                calculation = interaction.fields.getTextInputValue('calculation').toUpperCase();
                calculation = calculation.replace(/\s/g, '');
            } else {
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
                return
            }

            if(!calculation.match(/^[A-Z][*\/+-][A-Z]$/)){
                await interaction.reply({content: "L'opération doit ressembler à cela : A * B (Une lettre, une opération, une autre lettre)", ephemeral: true})
                return
            }

            if(!ceb_games[interaction.user.id]){
                await interaction.reply({content: "Cette partie a déjà été terminée.", ephemeral: true})
                return
            }

            const goal = ceb_games[interaction.user.id]["goal"]
            const numbers = ceb_games[interaction.user.id]["numbers"]
            const used_numbers = ceb_games[interaction.user.id]["used_numbers"]

            // Get values
            let index_number1 = calculation.charCodeAt(0) - 65
            let operation = calculation[1]
            let index_number2 = calculation.charCodeAt(2) - 65

            // Sanity check
            if(index_number1 >= numbers.length || index_number1<0){
                await interaction.reply({content: calculation[0] + " n'existe pas !", ephemeral: true})
                return
            }
            if(index_number2 >= numbers.length || index_number1<0){
                await interaction.reply({content: calculation[0] + " n'existe pas !", ephemeral: true})
                return
            }

            let undo_used_number = false;
            if(used_numbers.includes(index_number1)){
                await interaction.reply({content: calculation[0] + " a déjà été utilisé !", ephemeral: true})
                return
            }
            used_numbers.push(index_number1)
            if(used_numbers.includes(index_number2)){
                undo_used_number = true
                await interaction.reply({content: calculation[2] + " a déjà été utilisé !", ephemeral: true})
                return
            }
            used_numbers.push(index_number2)

            // Play
            if(operation == '*'){
                numbers.push(numbers[index_number1] * numbers[index_number2])
            } else if(operation == '/'){
                if(numbers[index_number1] % numbers[index_number2] != 0){
                    undo_used_number = true
                    await interaction.reply({content: "Les divisions sont euclidiennes et ne doivent pas avoir de reste !", ephemeral: true})
                    return
                }
                numbers.push(numbers[index_number1] / numbers[index_number2])
            } else if(operation == '+'){
                numbers.push(numbers[index_number1] + numbers[index_number2])
            } else if(operation == '-'){
                numbers.push(Math.abs(numbers[index_number1] - numbers[index_number2]))
            } else {
                undo_used_number = true
                await interaction.reply({content: "Les divisions sont euclidiennes et ne doivent pas avoir de reste !", ephemeral: true})
                return
            }

            if(undo_used_number){
                let index_number = used_numbers.indexOf(index_number1)
                if (index_number > -1) {
                    used_numbers.splice(index_number, 1)
                }
                index_number = used_numbers.indexOf(index_number2)
                if (index_number > -1) {
                    used_numbers.splice(index_number, 1)
                }
            }

            let description = "Trouve le nombre en utilisant uniquement les opérations de base (+ - / \\*)\n*Exemple de réponse : A + B. Puis C \\* E. Puis ...*\n\n"
            
            const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
            for(let i=0 ; i<numbers.length ; i++){
                if(used_numbers.includes(i)){
                    description += "~~" + letters[i]+" : "+numbers[i]+"~~\n"
                } else {
                    description += letters[i]+" : "+numbers[i]+"\n"
                }
            }

            description += "Objectif : "+goal

            let game_won = false
            if(numbers[numbers.length-1] == goal){
                game_won = true
                description += "\n\nFélicitations !"
                // get data from channel
                const channel = interaction.guild.channels.cache.get(process.env.CEB_DATA_CHANNEL_ID)
                const first_place_role = await interaction.guild.roles.fetch(process.env.CEB_FIRST_PLACE_ROLE_ID)
                const second_place_role = await interaction.guild.roles.fetch(process.env.CEB_SECOND_PLACE_ROLE_ID)
                const third_place_role = await interaction.guild.roles.fetch(process.env.CEB_THIRD_PLACE_ROLE_ID)
                let ceb_roles = [first_place_role,second_place_role,third_place_role]
                WinRoles.updateRoles(interaction.guild, channel, interaction.user, ceb_roles, "Compte est bon")
            }
            
            const footer = "/compteestbon pour démarrer une autre partie"

			let hexAccentColor = (await interaction.user.fetch(true)).hexAccentColor
			if(!hexAccentColor){
				hexAccentColor = process.env.EMBED_COLOR
			}

			const embed = new EmbedBuilder()
                .setColor(hexAccentColor)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTitle("Le compte est bon")
                .setDescription(description)
				.setFooter({ text: footer})
            
            if(game_won){
                await interaction.update({embeds: [embed], components:[]})
            } else {
                await interaction.update({embeds: [embed]})
            }
            
        } catch (error) {
			if(interaction) {
				logs.error(interaction.guild,interaction.user,"ceb_play",error)
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
            } else {
				logs.error(null,null,"ceb_play",error)
            }
		}
    }
};