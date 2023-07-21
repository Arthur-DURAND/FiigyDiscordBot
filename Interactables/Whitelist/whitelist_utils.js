const logs = require('../../Utils/Logs.js');
let Client = require('ssh2-sftp-client');
var fs = require('fs');

class WhitelistUtils {
    static async isInDatabase(interaction, uuid){
        // Check db
        let user = await interaction.client.sequelize.models.minecraft_whitelist.findOne({ where: { uuid: uuid} })
        if (user) {
            return true
        }
        user = await interaction.client.sequelize.models.minecraft_whitelist.findOne({ where: { friend_uuid: uuid} })
        if (user) {
            return true
        }
        return false
    }

    static async addPlayerToWhitelist(interaction, uuid, username){
        // Access sftp
        let sftp = new Client();
        sftp.connect({
            host: process.env.SFTP_IP_SERVER,
            port: process.env.SFTP_PORT,
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD
        }).then(async () => {
            // bdd -> json
            let wl_json = JSON.parse("[]")
            const minecraft_whitelist = await interaction.client.sequelize.models.minecraft_whitelist.findAll();
            for (let mw of minecraft_whitelist) {
                wl_json.push({uuid:mw.dataValues.uuid, name:mw.dataValues.pseudo})
                if(mw.dataValues.friend_uuid){
                    wl_json.push({uuid:mw.dataValues.friend_uuid, name:mw.dataValues.friend_pseudo})
                }
            }
            wl_json.push({uuid:uuid, name:username})

            fs.writeFileSync('./whitelist.json', JSON.stringify(wl_json, null, "\t"))
            sftp.fastPut("./whitelist.json","./whitelist.json")
        }).catch(err => {
            console.log(err, 'catch error');
            logs.error(interaction.guild,interaction.user,"whitelist_utils",err)
        });
    }
}

module.exports = WhitelistUtils;