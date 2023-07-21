const logs = require('./Logs.js');

class RoleUtil {

    static async giveOrTakeRole(guild, member, roleName) {
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            logs.warn(guild,member.user,"RoleUtils.giveOrTakeRole","Role not found: " + roleName)
            return console.log("Role not found: " + roleName)
        }
        
        if (member.roles.cache.has(role.id)){
            try {
                await member.roles.remove(role.id)
            } catch (error) {
                logs.error(guild,member.user,"RoleUtils.giveOrTakeRole","Error while removing role : "+roleName+". More infos : "+error)
            }
        } else {
            try {
                await member.roles.add(role)
            } catch (error) {
                logs.error(guild,member.user,"RoleUtils.giveOrTakeRole","Error while adding role : "+roleName+". More infos : "+error)
            }
        }
    }

    static async removeRole(guild, member, roleName) {
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            logs.warn(guild,member.user,"RoleUtils.removeRole","Role not found: " + roleName)
            return console.log("Role not found: " + roleName)
        }
        
        if (member.roles.cache.has(role.id)) {
            try {
                await member.roles.remove(role.id)
            } catch (error) {
                logs.error(guild,member.user,"RoleUtils.removeRole","Error while removing role : "+roleName+". More infos : "+error)
            }
        }
            
    }

    static async giveRole(guild, member, roleName) {
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            logs.warn(guild,member.user,"RoleUtils.giveRole","Role not found: " + roleName)
            return console.log("Role not found: " + roleName)
        }
        
        try {
            await member.roles.add(role)
        } catch (error) {
            logs.error(guild,member.user,"RoleUtils.giveRole","Error while adding role : "+roleName+". More infos : "+error)
        }
    }

    static async giveRoleKnowingRole(guild, member, role) {
        if (!role) {
            logs.warn(guild,member.user,"RoleUtils.giveRoleKnowingRole","Role not found: " + role)
            return console.log("Role not found: " + role)
        }
        
        await member.roles.add(role)
    }

    static async removeRoleKnowingRole(guild, member, role) {
        if (!role) {
            logs.warn(guild,member.user,"RoleUtils.removeRoleKnowingRole","Role not found: " + role)
            return console.log("Role not found: " + role)
        }
        
        await member.roles.remove(role)
    }

    static async hasRole(guild, member, roleName) {
        const role = await guild.roles.cache.find(role => role.name === roleName)

        if (!role)
            return false
        
        return member.roles.cache.has(role.id)
    }

    static async removeRoleFromString(guild, member, prefix) {
        guild.roles.cache.forEach(async role => {
			if (role.name.includes(prefix) && role.name != process.env.CONTENDER_ROLE) {
				if (member.roles.cache.has(role.id))
                    member.roles.remove(role.id)
			}
		});
    }

    static async getRoleListFromString(guild, prefix) {
        let list = []
        guild.roles.cache.forEach(async role => {
			if (role.name.includes(prefix)) {
				list.push(role)
			}
        });
        return list

    }

    static async getRoleIdFromString(guild, roleName) {
        let role = guild.roles.cache.find(role => role.name === roleName)
        if(role){
            return role.id
        }
        return null
    }

}

module.exports = RoleUtil;