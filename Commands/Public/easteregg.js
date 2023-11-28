const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hashCode(str) {
	var hash = 0,
	i, chr;
  	if (str.length === 0) return hash;
  	for (i = 0; i < str.length; i++) {
    	chr = str.charCodeAt(i);
    	hash = ((hash << 5) - hash) + chr;
    	hash |= 0;
  }
  return hash + 1;
}
// By ChatGPT
function hashFunction(a, b, c, d, e, f, g) {
    let hashValue = 354;
	hashValue = (14 * hashValue + g) % (Math.pow(2,30));
	hashValue = (614 * hashValue + a) % (Math.pow(2,30));
	hashValue = (234 * hashValue + b) % (Math.pow(2,30));
	hashValue = (12 * hashValue + c) % (Math.pow(2,30));
	hashValue = (4 * hashValue + d) % (Math.pow(2,30));
	hashValue = (61 * hashValue + e) % (Math.pow(2,30));
	hashValue = (1786 * hashValue + f) % (Math.pow(2,30));
	return hashValue;
}
// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("easteregg")
		.setDescription("Commande à utiliser une fois un easter egg trouvé sur le server Minecraft.")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addStringOption(option =>
            option.setName('code')
                .setDescription('Le code donné par le jeu.')
                .setRequired(true)),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {
			if(!interaction.guild)
				logs.error(null, interaction.user, "Error easteregg : interaction.guild is null")

			if(!interaction.channel)
				logs.error(interaction.guild,interaction.user,"easteregg","interaction.channel is null")

			if(!interaction.options)
                logs.error(interaction.guild,interaction.user,"easteregg","interaction.options is null")

			logs.debug(interaction.guild,interaction.user,"easteregg",null)

			// Code
			let code = interaction.options.getString('code');

			// Get Username
			let minecraft_whitelist = await interaction.client.sequelize.models.minecraft_whitelist.findOne({ where: { discord_id: interaction.user.id} })
			let username = minecraft_whitelist.pseudo
			username = Math.abs(hashCode(username) % Math.pow(2, 31) - 1);

			if(username == null){
				await interaction.reply({content: "Impossible de trouver ton pseudo Minecraft. Malheureusement, cette fonctionnalité n'est pas disponible pour les comptes whitelisted en +1.", ephemeral: true})
				return
			}

			// Get date
			let now = new Date();
			let year = now.getFullYear()
			let start = new Date(year, 0, 0);
			let diff = now - start;
			let oneDay = 1000 * 60 * 60 * 24;
			let day = Math.floor(diff / oneDay);

			// Get every head locations
			let easter_eggs = process.env.EASTEREGG_LOCATIONS.split(" ")
			let easteregg_constant = process.env.EASTEREGG_CONSTANT
			// Try every codes
			console.log("size:"+easter_eggs.length)
			found = -1;
			for (var i = 0; i < easter_eggs.length; i++) {
				let l = easter_eggs[i].split(",")
				let new_code = hashFunction(parseInt(l[0]), parseInt(l[1]), parseInt(l[2]), parseInt(day), parseInt(year), parseInt(username), parseInt(easteregg_constant))
				if(code == new_code){
					found = i;
					break
				}
			}

			if(found == -1){
				await interaction.reply({content: "Code invalide !", ephemeral: true})
				return;
			}

			// get user data
			let user_data = await interaction.client.sequelize.models.easter_eggs.findOne({ where: { discord_id: interaction.user.id} })
			
			let eggs_data = ""
			if (user_data) {
				eggs_data = user_data.eggs_data

				// Check if already found
				if(eggs_data.length > found){
					if(eggs_data[found] == '1'){
						await interaction.reply({content: "Tu as déjà trouvé cette tête !", ephemeral: true})
						return;
					} else {
						eggs_data = setCharAt(eggs_data, found, '1')
					}
				} else {
					while(eggs_data.length < found){
						eggs_data += '0'
					}
					eggs_data += '1'
				}
				await user_data.update({eggs_data: eggs_data})
			} else {
				eggs_data = ""
				while(eggs_data.length < found){
					eggs_data += '0'
				}
				eggs_data += '1'
				await interaction.client.sequelize.models.easter_eggs.create({
					discord_id: interaction.user.id,
					eggs_data: eggs_data
				})
			}

			await interaction.reply({content: "Code valide ! Ecris \""+process.env.EASTEREGG_SENTENCE+"\" dans <#"+process.env.MINECRAFT_CHAT_CHANNEL_ID+"> pour valider l'opération, et peut être obtenir le rôle associé !", ephemeral: true}) 
		}
}