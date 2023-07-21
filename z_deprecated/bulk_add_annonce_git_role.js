const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js")
const RoleUtil = require('../Utils/RoleUtil.js');
const logs = require('../Utils/Logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bulk_add_annonce_git_role")
		.setDescription("Give annonce git role to everyone not present in audit logs")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

			interaction.reply({content: "This code has been commented!", ephemeral: true})

			/* interaction.reply({content: "Doing it!", ephemeral: true})

			if(!interaction.guild) return

			const members = await interaction.guild.members.fetch()
			targets = new Set()
			members.forEach(member => {
				if(!member.user.bot){
					targets.add(member.user.id)
				}
			})

			console.log(targets.size)
			console.log(targets)

			let tookRole = new Set()

			const auditLogs = await interaction.guild.fetchAuditLogs({
				limit: 100,
				type: 25 // Member role update 
			}) // TODO USE BEFORE ! https://discord.js.org/#/docs/main/stable/typedef/GuildAuditLogsFetchOptions
			//https://discord.js.org/#/docs/main/stable/class/GuildAuditLogs
			let lastAuditLog = null
			for(let i=0 ; i<auditLogs.entries.size ; i++){
				let auditLog = auditLogs.entries.at(i)
				if(auditLog.executor && auditLog.executor.id == 1003299107269529621){
					if(auditLog.target && !auditLog.target.bot) {
						targets.delete(auditLog.target.id)
						tookRole.add(auditLog.target.username+"#"+auditLog.target.tag)
					}
				}
				if(i == auditLogs.entries.size-1)
					lastAuditLog = auditLog
			}
			for(let i = 0 ; i < 10 ; i++){
				const auditLogs = await interaction.guild.fetchAuditLogs({
					limit: 100,
					type: 25, // Member role update
					before: lastAuditLog 
				})
				for(let i=0 ; i<auditLogs.entries.size ; i++){
					let auditLog = auditLogs.entries.at(i)
					if(auditLog.executor && (auditLog.executor.id == 1003299107269529621)){
						if(auditLog.target && !auditLog.target.bot) {
							targets.delete(auditLog.target.id)
							tookRole.add(auditLog.target.username+"#"+auditLog.target.tag)
						}
					}
					if(i == auditLogs.entries.size-1)
						lastAuditLog = auditLog
				}
				if(auditLogs.entries.size != 100){
					break
				}
			}

			console.log(targets)

			// console.log(targets)

			console.log(tookRole)

			let role = interaction.guild.roles.cache.find(role => role.name === "🔉┃GIT")
			console.log(role)
			let count = 0
			targets.forEach(async (userId) => {
				const member = await interaction.guild.members.fetch(userId)
				RoleUtil.giveRoleKnowingRole(interaction.guild,member,role)
				console.log(count++)
			}) */
		}
}