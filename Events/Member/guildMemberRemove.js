module.exports = {
	name: "guildMemberRemove",

	execute(member) {
		// console.log("guildMemberRemove")

		if(!(member.guild || member.guild.channels)){
			console.log("Error guildMemberRemove : member.guild or member.guild.channels is null !")
			return
		}

		const bye_channel = member.guild.channels.cache.get(process.env.BYE_CHANNEL)

		if(bye_channel != null)
			if(member){
				roles = member.roles.cache.map(role => role.name)
				str_role = ""
				roles.forEach(role => {
					if(role != "@everyone"){
						str_role += role +"\n"
					}
				})
				bye_channel.send(member.user.username+"#"+member.user.discriminator+" (id: "+member.user.id+") est parti !\nRoles :\n"+str_role)
			} else {
				console.log("Error guildMemberRemove : Member or member.user is null!")
			}
		else
			console.log("Error guildMemberRemove : Cannot find bye channel.")
	}
}