
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const ceb_games = require('./temp_ceb.js')

module.exports = {
	name: "ceb_reset",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"ceb_reset",null)

            const [_, ...params] = interaction.customId.split("?")
            if(params.length < 1){
                logs.error(interaction.guild,interaction.user,"ceb_reset","No params")
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
            ceb_games[interaction.user.id]["numbers"] = ceb_games[interaction.user.id]["numbers"].slice(0,6)
            const numbers = ceb_games[interaction.user.id]["numbers"]
            ceb_games[interaction.user.id]["used_numbers"] = []

            const description = "Trouve le nombre en utilisant uniquement les opérations de base (+ - / \\*)\n*Exemple de réponse : A + B. Puis C \\* E. Puis ...*\n\nA : "+numbers[0]+"\nB : "+numbers[1]+"\nC : "+numbers[2]+"\nD : "+numbers[3]+"\nE : "+numbers[4]+"\nF : "+numbers[5]+"\nObjectif : "+goal
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

            await interaction.update({embeds: [embed]})

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"ceb_reset",error)
			else
				logs.error(null,null,"ceb_reset",error)
		}
    }
};