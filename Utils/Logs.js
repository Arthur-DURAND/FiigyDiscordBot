const { EmbedBuilder } = require("discord.js")
require('dotenv').config();


class Logs {

    static warn(guild, user, method, message) {
        if(process.env.LOG_LEVEL >= 2) {

            if(guild === null){
                console.log("WARN : guild is null : "+user+" ; "+method+" ; "+message)
                return
            }

            let warnChannelID = process.env.IS_DEV == "true" ? process.env.DEV_LOG_WARN_CHANNEL : process.env.LOG_WARN_CHANNEL
            let str = new Date().toISOString()
            if(user != null){
                str += "\n    User : "+user.username+" ; <@"+user.id+">"
            }
            if(method != null){
                str += "\n    Method : "+method
            }
            if(message != null){
                str += "\n    "+message
            }
            let warnChannel = guild.channels.cache.get(warnChannelID)
            if(warnChannel != null) {
                const embed = new EmbedBuilder()
                    .setColor("#ff9500")
                    .setTitle("WARN")
                    .setDescription(str)
                warnChannel.send({content: "<@&"+process.env.LOGS_WARN_ROLE_ID+">", embeds: [embed]})
            } else {
                console.log("Cannot get warnChannel: ")
                console.log(str)
            } 
        }
    }

    static error(guild, user, method, message) {
        if(process.env.LOG_LEVEL >= 1) {

            if(guild === null){
                console.log("ERROR : guild is null : "+user+" ; "+method+" ; "+message)
                return
            }

            let errorChannelID = process.env.IS_DEV == "true" ? process.env.DEV_LOG_ERROR_CHANNEL : process.env.LOG_ERROR_CHANNEL
            let str = new Date().toISOString()
            if(user != null){
                str += "\n    User : "+user.username+" ; <@"+user.id+">"
            }
            if(method != null){
                str += "\n    Method : "+method
            }
            if(message != null){
                str += "\n    "+message
            }
            let errorChannel = guild.channels.cache.get(errorChannelID)
            if(errorChannel != null) {
                const embed = new EmbedBuilder()
                    .setColor("#c2000a")
                    .setTitle("ERROR")
                    .setDescription(str)
                errorChannel.send({content: "<@&"+process.env.LOGS_ERROR_ROLE_ID+">", embeds: [embed]})
            } else {
                console.log("Cannot get errorChannel: ")
                console.log(str)
            }
        }

    }

    static info(guild, user, method, message) {
        if(process.env.LOG_LEVEL >= 3) {

            if(guild === null){
                console.log("INFO : guild is null : "+user+" ; "+method+" ; "+message)
                return
            }

            let infoChannelID = process.env.IS_DEV == "true" ? process.env.DEV_LOG_INFO_CHANNEL : process.env.LOG_INFO_CHANNEL
            let str = new Date().toISOString()
            if(user != null){
                str += "\n    User : "+user.username+" ; <@"+user.id+">"
            }
            if(method != null){
                str += "\n    Method : "+method
            }
            if(message != null){
                str += "\n    "+message
            }
            let infoChannel = guild.channels.cache.get(infoChannelID)
            if(infoChannel != null) {
                const embed = new EmbedBuilder()
                    .setColor("#f0f3ff")
                    .setTitle("INFO")
                    .setDescription(str)
                    infoChannel.send({content: "<@&"+process.env.LOGS_INFO_ROLE_ID+">", embeds: [embed]})
            } else {
                console.log("Cannot get infoChannel: ")
                console.log(str)
            }
        }
    }

    static debug(guild, user, method, message) {
        if(process.env.LOG_LEVEL >= 4) {
            
            if(guild === null){
                console.log("DEBUG : guild is null : "+user+" ; "+method+" ; "+message)
                return
            }

            let debugChannelID = process.env.IS_DEV == "true" ? process.env.DEV_LOG_DEBUG_CHANNEL : process.env.LOG_DEBUG_CHANNEL
            let str = new Date().toISOString()
            if(user != null){
                str += "\n    User : "+user.username+" ; <@"+user.id+">"
            }
            if(method != null){
                str += "\n    Method : "+method
            }
            if(message != null){
                str += "\n    "+message
            }
            let debugChannel = guild.channels.cache.get(debugChannelID)
            if(debugChannel != null) {
                const embed = new EmbedBuilder()
                    .setColor("#7ccf69")
                    .setTitle("INFO")
                    .setDescription(str)
                debugChannel.send({content: "<@&"+process.env.LOGS_DEBUG_ROLE_ID+">", embeds: [embed]})
            } else {
                console.log("Cannot get debugChannel: ")
                console.log(str)
            }
        }
    }

}

module.exports = Logs;