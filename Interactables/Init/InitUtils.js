const logs = require('../../Utils/Logs.js');
const data = require('./init_data.js')
const RoleUtil = require('../../Utils/RoleUtil.js');


class InitUtils {
    static checkInteraction(interaction, file_name){
        if(!interaction)
            logs.error(null, null, file_name, "Interaction is null")
        else {
            if(!interaction.guild)
                logs.error(null, interaction.user, file_name, "Interaction.guild is null")
            if(!interaction.member)
                logs.error(interaction.guild, null, file_name, "Interaction.member is null")
        }
    }

    static fillMemberRole(interaction, file_name, prefix){
        if(!interaction.member){
            logs.error(interaction.guild, null, file_name, "Interaction.member is null")
            return
        }
        if(!interaction.member.id){
            logs.error(interaction.guild, null, file_name, "Interaction.member.id is null")
            return
        }
        let member_roles = data[interaction.member.id]
        if(!member_roles){
            logs.error(interaction.guild, interaction.user, file_name, "member_roles is null")
            member_roles = []
        }
		if(interaction.values){
			let params = []
			interaction.values.forEach(value => {
				const [_, ...valueParams] = value.split("?");
				params.push(...valueParams)
			});
			params.forEach(async param => {
				if(param != "skip"){
					let role_id = await RoleUtil.getRoleIdFromString(interaction.guild, prefix + param)
					member_roles.push(role_id)
				}
			})
		}
    }
}

module.exports = InitUtils;