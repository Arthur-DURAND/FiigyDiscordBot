const { Client } = require("discord.js")
const RoleUtil = require("../../Utils/RoleUtil")
const dbUtil = require('../../Utils/dbUtil.js');

module.exports = {
	name: "messageCreate",

	async execute(message, client) {

		// Easter egg
		if(message.channelId == process.env.MINECRAFT_CHAT_CHANNEL_ID){
			if(message.content.includes(process.env.EASTEREGG_SENTENCE)){
				let sequelize = dbUtil.connectionInstance()
				let user_data = await sequelize.models.easter_eggs.findOne({ where: { discord_id: message.author.id} })
				if(user_data){
					let eggs_data = user_data.eggs_data
					let nb_eggs = 0
					for(let c of eggs_data){
						if(c == '1'){
							nb_eggs++
						}
					}
					let easteregg_role_numbers = process.env.EASTEREGG_ROLE_NUMBERS.split(" ")
					let index = 0
					let delta = 0
					for(var i = 0 ; i<easteregg_role_numbers.length ; i++){
						if(easteregg_role_numbers[i] == nb_eggs){
							index = i
							break
						} else if(easteregg_role_numbers[i] > nb_eggs){
							index = i - 1 // always > 0
							delta = easteregg_role_numbers[i] - nb_eggs
							break
						}
					}

					let guild = client.guilds.cache.get(message.guildId);
					let member = guild.members.cache.get(message.author.id);

					for(let r of process.env.EASTEREGG_ROLE_IDS.split(" ")){
						let r2 = await guild.roles.fetch(r)
						await RoleUtil.removeRoleKnowingRole(guild, member, r2)
					}
					let role = await guild.roles.fetch(process.env.EASTEREGG_ROLE_IDS.split(" ")[index])
					await RoleUtil.giveRoleKnowingRole(guild, member, role)

					if(delta > 0){
						message.reply({content: "Félicitations ! Tu as trouvé "+nb_eggs+" têtes sur "+process.env.EASTEREGG_LOCATIONS.split(" ").length+" !\nPlus que "+delta+" têtes avant le prochain rôle."}) 
					} else {
						let m = await message.reply({content: "Félicitations ! Tu as trouvé "+nb_eggs+" têtes sur "+process.env.EASTEREGG_LOCATIONS.split(" ").length+" !\nTu as désormais le rôle \""+role.name+"\" :)"})
						m.edit("Félicitations ! Tu as trouvé "+nb_eggs+" têtes sur "+process.env.EASTEREGG_LOCATIONS.split(" ").length+" !\nTu as désormais le rôle <@&"+role.id+"> :)")
					}
				} else {
					message.reply({content: "Tu n'as trouvé aucune tête !"}) 
				}
			}
		}
	}
}