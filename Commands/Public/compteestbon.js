const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const ceb_games = require('../../Interactables/Compteestbon/temp_ceb.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName("compteestbon")
		.setDescription("Lance une partie du compte est bon.")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				console.log("Error compteestbon : interaction.guild is null")

			logs.debug(interaction.guild,interaction.user,"compteestbon",null)

			if(interaction.channelId !== process.env.CEB_PLAY_CHANNEL_ID){
				await interaction.reply({content: "Ce n'est pas le bon channel pour cette commande !", ephemeral: true})
                return
			}

			let goal = 0
			const max_number = 10
			let numbers_copy = null
			while(goal < max_number*5){
			
				let numbers = [Math.floor(Math.random() * max_number)+1,
								Math.floor(Math.random() * max_number)+1,
								Math.floor(Math.random() * max_number)+1,
								Math.floor(Math.random() * max_number*2)+1,
								Math.floor(Math.random() * max_number*2)+1,
								Math.floor(Math.random() * max_number*3)+1]

				numbers_copy = [...numbers]

				for(let i=0 ; i<5 ; i++){
					let index1 = Math.floor(Math.random() * numbers.length)
					let number1 = numbers[index1]
					numbers.splice(index1,1)
					let index2 = Math.floor(Math.random() * numbers.length)
					let number2 = numbers[index2]
					numbers.splice(index2,1)

					let new_number = null
					if(number1%number2==0){
						new_number = number1/number2
					} else if(number2%number1==0){
						new_number = number2/number1
					} else {
						let operation = Math.floor(Math.random() * 3)
						if(operation == 0){
							new_number = number1+number2
						} else if(operation == 1){
							if(number1 == number2){
								new_number = number1 + number2
							} else {
								new_number = Math.abs(number1-number2)
							}
						} else {
							new_number = number1*number2
						}
					}
					
					numbers.push(new_number)
					goal = numbers[0]
				}
			}
			

			ceb_games[interaction.user.id] = {numbers:numbers_copy, goal:goal, used_numbers:[]}

			const description = "Trouve le nombre en utilisant uniquement les opérations de base (+ - / \\*)\n*Exemple de réponse : A + B. Puis C \\* E. Puis ...*\n\nA : "+numbers_copy[0]+"\nB : "+numbers_copy[1]+"\nC : "+numbers_copy[2]+"\nD : "+numbers_copy[3]+"\nE : "+numbers_copy[4]+"\nF : "+numbers_copy[5]+"\nObjectif : "+goal
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

			const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ceb_write_calculation?'+interaction.user.id)
                        .setLabel('Réaliser un calcul')
                        .setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
                        .setCustomId('ceb_reset?'+interaction.user.id)
                        .setLabel('Recommencer')
                        .setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
                        .setCustomId('ceb_cancel?'+interaction.user.id)
                        .setLabel('Abandonner')
                        .setStyle(ButtonStyle.Danger),
			);

            interaction.reply({embeds: [embed], components:[row]})

		}
}