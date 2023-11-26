const { ActionRowBuilder, ButtonStyle, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

async function displayTournoi(player_list ){
    let schema_final = "Matchs pour ce round : \n\n"
    for (let i = 0; i < player_list.length; i += 2) {
        const player1 = player_list[i];
        const player2 = player_list[i + 1];
        if(player2) {
            schema_final += await displayMatch(player1,player2)
        } else { //Si nombre impair de joueur
            console.log("${player1} a un adversaire libre pdt ce round")
        }
    }
    return schema_final;
    
}

async function displayMatch(player1,player2) { 
    let schema = "-------------------\n"
    schema += "${player1} vs ${player2} \n"
    schema += "-------------------\n"
    return schema;
}

module.exports = { displayTournoi }