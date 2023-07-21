
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const wordle_games = require('./temp_wordle.js')
const RoleUtil = require('../../Utils/RoleUtil.js');

module.exports = {
	name: "wordle_cancel",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"wordle_cancel",null)

            const [_, ...params] = interaction.customId.split("?")
            if(params.length < 1){
                logs.error(interaction.guild,interaction.user,"wordle_cancel","No params")
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
                return
            } else {
                if(params[0] !== interaction.user.id){
                    await interaction.reply({content: "Cette partie a été démarrée par quelqu'un d'autre !", ephemeral: true})
                    return
                }
            }

            if(!wordle_games[interaction.user.id]){
                await interaction.reply({content: "Cette partie a déjà été terminée.", ephemeral: true})
                return
            }

            const word = wordle_games[interaction.user.id]["word"]
            const attempts = wordle_games[interaction.user.id]["attemps"]

            let description = "**A** signifie qu'il y a un A à cette place.\n__A__ signifie qu'il y a un A à une autre place.\nA signifie qu'il n'y a pas de A dans le mot.\n\n"
            for(let i=0 ; i< attempts.length ; i++){
                let attempt = attempts[i];
                description += attempt + "\n";
            }
            for(let i=attempts.length ; i<6 ; i++){
                description += "\\_ \\_ \\_ \\_ \\_\n";
            }

            description += "\nPartie annulée !\nLe mot était : " + word

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

            delete wordle_games[interaction.user.id]

            await interaction.update({embeds: [embed], components:[]})

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"wordle_cancel",error)
			else
				logs.error(null,null,"wordle_cancel",error)
		}
    }
};