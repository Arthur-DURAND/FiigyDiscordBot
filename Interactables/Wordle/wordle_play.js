
const { EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
const WinRoles = require('../GameUtils/WinRoles.js');
const wordle_games = require('./temp_wordle.js')
const WORDS = require("./mots_valides.js");
const { Op, Transaction } = require('sequelize')


module.exports = {
	name: "wordle_play",
	async execute(interaction) {

        const t = await interaction.client.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        })

        try {

            logs.debug(interaction.guild,interaction.user,"wordle_play",null)

            let user_word = null
            if(interaction.fields)
                user_word = interaction.fields.getTextInputValue('word').toUpperCase();

            if(user_word.length != 5){
                await t.rollback();
                await interaction.reply({content: "Le mot doit avoir 5 lettres !", ephemeral: true})
                return
            }

            if(!WORDS.includes(user_word.toLowerCase())){
                await t.rollback();
                await interaction.reply({content: "Ce mot n'est pas dans le dictionnaire de wordle. Le mot à chercher est en français !", ephemeral: true})
                return
            }

            let user_game_stats = await interaction.client.sequelize.models.discord_games.findOne({
                where: {
                    discord_id: interaction.user.id
                }}
            );
            let words_played
            let wins
            let tries
            let globalWins
            if(!user_game_stats){
                await interaction.client.sequelize.models.discord_games.create({
                    discord_id: interaction.user.id,
                    wordle_wins: 0,
                    wordle_words_played: user_word
                }, { transaction: t })
                words_played = user_word
                wins = 0
                tries = 0
                globalWins = 0
            } else {
                if(user_game_stats.wordle_words_played.length > 25){
                    await t.rollback();
                    await interaction.reply({content: "Tu as déjà fini ta partie !", ephemeral: true})
                    return
                }
                words_played = user_game_stats.wordle_words_played + user_word
                await interaction.client.sequelize.models.discord_games.update({
                    wordle_words_played: words_played
                }, {where: {discord_id: interaction.user.id}}, { transaction: t })
                wins = user_game_stats.wordle_wins
                tries = user_game_stats.wordle_tries
                globalWins = user_game_stats.wordle_global_wins
            }
            

            const word = await interaction.client.sequelize.models.singleton.findOne({
                where: {
                    name: "WORDLE"
                }}
            )
            if(!word || !word.value){
                await t.rollback();
                logs.warn(interaction.guild,interaction.user,"wordle_play","Impossible to access word")
                await interaction.reply({content: "Une erreur s'est produite !", ephemeral: true})
                return
            }

            const { displayWordle } = require("../../Interactables/Wordle/wordle_display")
            const displayData = await displayWordle(interaction, word.value.toUpperCase(), words_played)

            
            if(displayData[2]) {
                interaction.channel.send("<@"+interaction.user.id+"> ("+interaction.user.displayName+") a réussi le wordle du jour :tada: C'est sa **"+(wins+1)+"e** victoire(s) cette saison !")
                await interaction.client.sequelize.models.discord_games.update({
                    wordle_wins: wins+1,
                    wordle_tries: tries + words_played.length/5,
                    wordle_global_wins: globalWins+1
                }, {where: {discord_id: interaction.user.id}}, { transaction: t })
                await interaction.update({embeds: [displayData[0]], components:[], ephemeral:true})
            } else if (displayData[3]){
                await interaction.update({embeds: [displayData[0]], components:[], ephemeral:true})
            } else {
                await interaction.update({embeds: [displayData[0]], ephemeral:true})
            }
            await t.commit();
            
        } catch (error) {
            await t.rollback();
			if(interaction) {
				logs.error(interaction.guild,interaction.user,"wordle_play",error)
                await interaction.reply({content: "Une erreur s'est produite.", ephemeral: true})
            } else {
				logs.error(null,null,"wordle_play",error)
            }
		}
    }
};