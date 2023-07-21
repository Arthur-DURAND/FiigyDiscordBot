const { ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("load_emails")
		.setDescription("Load channel emails into db")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			try {
				if(!interaction.guild)
					console.log("Error load_emails : interaction.guild is null")

				logs.debug(interaction.guild,interaction.user,"load_emails",null)

				const user_table = await interaction.client.sequelize.models.user

                const channel = interaction.guild.channels.cache.get(process.env.VERIFY_EMAIL_CHANNEL)

				let message = await channel.messages
						.fetch({ limit: 1 })
						.then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))

						//message.mentions.users.keys().next().value

				if(message && message.content){
					let array = message.content.split(":")    
					if(array.length > 1){
						await user_table.create({
							discord_id: message.mentions.users.keys().next().value,
							email: array[1].replace(/\s+/g, '')
						})
					}
				}

				while (message) {
						await channel.messages
								.fetch({ limit: 100, before: message.id })
								.then(messagePage => {
										messagePage.forEach(async msg => {
												let array = msg.content.split(":")
												if(array.length > 1){
													try {
														await user_table.create({
															discord_id: msg.mentions.users.keys().next().value,
															email: array[1].replace(/\s+/g, '')
														})
													} catch (error) {
														console.log(error)
													}
												}
										});
										message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
								})
				}


				/*await user_table.create({
					discord_id: member.id,
					email: email
				})*/

				

				await interaction.reply({content:"Done!", ephemeral: true});
			} catch (error) {
				await interaction.reply({content:"An error happened!", ephemeral: true});
				if(interaction)
					logs.error(interaction.guild,interaction.user,"load_emails",error)
				else
					logs.error(null,null,"load_emails",error)
			}

		}
}