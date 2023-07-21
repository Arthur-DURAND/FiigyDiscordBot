const RoleUtil = require('../../Utils/RoleUtil.js');
const logs = require('../../Utils/Logs.js');


class WinRoles {
    static async updateRoles(guild, channel, user, roles, nom){

        try{

            const members = await guild.members.fetch({force:true})
            
            let wordle_top3 = [null,null,null]

            members.forEach(member => {
                for(let i=0 ; i<3 ; i++){
                    if(member.roles.cache.some(r => r.id === roles[i].id)){
                        wordle_top3[i] = [roles[i].name.match(/[0-9]+/)[0],member.user.id]
                    }
                }
            })

            let player_wins = null;
            let player_message = null;

            let message = await channel.messages
                            .fetch({ limit: 1 })
                            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))

            if(message && message.content){
                let array = message.content.split(":")    
                if(array.length == 3){
                    if(array[0] === user.id){
                        player_wins = array[2]
                        player_message = message;
                    }
                } else {
                    logs.warn(guild,null,"verify_email","Bad formatted line ! "+message.content)
                }
            }

            while (message) {
                await channel.messages
                    .fetch({ limit: 100, before: message.id })
                    .then(messagePage => {
                        messagePage.forEach(msg => {
                            let array = msg.content.split(":")
                            if(array.length == 3){
                                if(array[0] === user.id) {
                                    player_wins = array[2]
                                    player_message = msg
                                }
                            } else {
                                logs.warn(guild,null,"verify_email","Bad formatted line ! "+message.content)
                            }
                        });
                        message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                    })
            }

            // Update wordle data
            if(player_message == null){
                // write msg
                channel.send(user.id+":<@"+user.id+">:1")
                player_wins = 1
            } else {
                // edit
                player_wins = parseInt(player_wins) + 1
                player_message.edit(user.id+":<@"+user.id+">:"+player_wins)
            }

            const player_member = await guild.members.fetch(user.id)
            // Update roles
            for(let i=0 ; i<3 ; i++){
                // No one has this role
                if (!wordle_top3[i][1]){
                    RoleUtil.giveRoleKnowingRole(guild, player_member, roles[i])
                    changeRoleWins(roles, i, player_wins, nom)
                    player_member.user.send("Félicitations ! Tu es désormais top "+(i+1)+" dans le jeu "+nom)
                    break
                // You're better than the role owner
                } else if (player_wins > parseInt(wordle_top3[i][0]) && wordle_top3[i][1] !== user.id) {
                    // User
                    // Remove role
                    if(i+1 < 3)
                        RoleUtil.removeRoleKnowingRole(guild, player_member, roles[i+1])
                    if(i+2 < 3)
                        RoleUtil.removeRoleKnowingRole(guild, player_member, roles[i+2])
                    // Give role
                    RoleUtil.giveRoleKnowingRole(guild, player_member, roles[i])
                    // update role name
                    changeRoleWins(roles, i, player_wins, nom)
                    player_member.user.send("Félicitations ! Tu es désormais top "+(i+1)+" dans le jeu "+nom)

                    let player_index = 2
                    let player_found = false
                    for(let j=0 ; j<3 ; j++){
                        if(wordle_top3[j][1] == user.id){
                            player_index = j
                            player_found = true
                            break
                        }
                    }

                    // Change roles for other players
                    for(let j=player_index ; j>=i ; j--){
                        if(wordle_top3[j][1]){
                            const member = await guild.members.fetch(wordle_top3[j][1])

                            if(!player_found || j!=player_index){
                                // remove role j
                                RoleUtil.removeRoleKnowingRole(guild, member, roles[j])
                                // give role j+1
                                if(j+1 < 3) {
                                    RoleUtil.giveRoleKnowingRole(guild, member, roles[j+1])
                                    // update role j+1 name
                                    changeRoleWins(roles, j+1, wordle_top3[j][0], nom)
                                }

                                member.user.send("Tu as malheureusement perdu ton top "+(i+1)+" dans le jeu "+nom+". Mais rien n'est perdu ! Tu n'as qu'une victoire de retard.")
                            }
                        }
                    }
                    break
                } else if(wordle_top3[i][1] == user.id){
                    changeRoleWins(roles, i, player_wins, nom)
                    break
                }
            }

        } catch (error) {
            logs.error(null,null,"WinRoles",error)
        }
    }
}

module.exports = WinRoles;

function changeRoleWins(roles, index, wins, nom) {
    const role = roles[index]
    if(index == 0){ // Use table with emoji ?
        role.setName("🥇┃"+nom+" "+wins+" wins")
    } else if(index == 1){
        role.setName("🥈┃"+nom+" "+wins+" wins")
    } else if(index == 2){
        role.setName("🥉┃"+nom+" "+wins+" wins")
    }
}