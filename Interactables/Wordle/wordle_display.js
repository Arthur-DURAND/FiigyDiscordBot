const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

async function displayWordle(interaction, word, wordle_words_played){
    let description = "**A** signifie qu'il y a un A à cette place.\n__A__ signifie qu'il y a un A à une autre place.\nA signifie qu'il n'y a pas de A dans le mot.\n\n"
    for(let i=0 ; i< wordle_words_played.length ; i+=5){
        let attempt = wordle_words_played.slice(i, i+5);
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
    for(let i=wordle_words_played.length / 5 ; i<6 ; i++){
        description += "\\_ \\_ \\_ \\_ \\_\n";
    }

    let win = false
    let overstep = false
    if(wordle_words_played.length >= 5 && word === wordle_words_played.slice(wordle_words_played.length-5, wordle_words_played.length)){
        description += "\nFélicitations !"
        win = true
    } else if(wordle_words_played.length >= 30){ // 5 * 6
        description += "\nPartie finie !\nLe mot était : "+word
        overstep = true
    }

    const footer = "Une nouveau mot est généré chaque jour !"

    const embed = new EmbedBuilder()
        .setColor(process.env.EMBED_COLOR)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTitle("Wordle")
        .setDescription(description)
        .setFooter({ text: footer})

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('wordle_choose_word')
                .setLabel('Proposer un mot')
                .setStyle(ButtonStyle.Primary),
    );
    return [embed, row, win, overstep]
}

module.exports = { displayWordle }
