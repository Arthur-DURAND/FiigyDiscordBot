
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const ceb_games = require('./temp_ceb.js')

module.exports = {
	name: "ceb_cancel",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"ceb_cancel",null)

            const [_, ...params] = interaction.customId.split("?")
            if(params.length < 1){
                logs.error(interaction.guild,interaction.user,"ceb_cancel","No params")
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
                return
            } else {
                if(params[0] !== interaction.user.id){
                    await interaction.reply({content: "Cette partie a été démarrée par quelqu'un d'autre !", ephemeral: true})
                    return
                }
            }

            if(!ceb_games[interaction.user.id]){
                await interaction.reply({content: "Cette partie a déjà été terminée.", ephemeral: true})
                return
            }
            const goal = ceb_games[interaction.user.id]["goal"]
            const numbers = ceb_games[interaction.user.id]["numbers"]
            const used_numbers = ceb_games[interaction.user.id]["used_numbers"]

            let description = "Trouve le nombre en utilisant uniquement les opérations de base (+ - / \\*)\n*Exemple de réponse : A + B. Puis C \\* E. Puis ...*\n\n"
            
            const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
            for(let i=0 ; i<numbers.length ; i++){
                if(used_numbers.includes(i)){
                    description += "~~" + letters[i]+" : "+numbers[i]+"~~\n"
                } else {
                    description += letters[i]+" : "+numbers[i]+"\n"
                }
            }

            description += "Objectif : "+goal+"\n\nPartie annulée !"
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

            delete ceb_games[interaction.user.id]

            await interaction.update({embeds: [embed], components:[]})

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"ceb_cancel",error)
			else
				logs.error(null,null,"ceb_cancel",error)
		}
    }
};