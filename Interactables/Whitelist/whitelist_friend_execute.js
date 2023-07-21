
const logs = require('../../Utils/Logs.js');
const RoleUtil = require('../../Utils/RoleUtil.js');
var https = require('https');
const WhitelistUtils = require('./whitelist_utils.js')


module.exports = {
	name: "whitelist_friend_execute",
	async execute(interaction) {

        try {

            logs.debug(interaction.guild,interaction.user,"whitelist_friend_execute",null)

            let uuid = null
            const username = interaction.fields.getTextInputValue('username')

            // Check mojang's api
            var options = { //https://api.minecraftservices.com/minecraft/profile/lookup/name/
              host: 'api.minecraftservices.com',
              path: '/minecraft/profile/lookup/name/'+username
            };
            callback = function(response) {
              var str = '';
            
              //another chunk of data has been received, so append it to `str`
              response.on('data', function (chunk) {
                str += chunk;
              });
            
              //the whole response has been received, so we just print it out here
              response.on('end', async function () {
                json_user = JSON.parse(str)
                uuid = json_user.id

                if(!uuid){
                  await interaction.reply({content: "Ce nom d'utilisateur n'existe pas ! N'hésite pas à contacter un admin si tu penses que c'est une erreur.", ephemeral: true})
                  return
                }
                uuid = [uuid.slice(0, 8), "-", uuid.slice(8, 12), "-", uuid.slice(12, 16), "-", uuid.slice(16, 20), "-", uuid.slice(20)].join('')

                if(await WhitelistUtils.isInDatabase(interaction, uuid)){
                  await interaction.reply({content: "Ce joueur est déjà whitelisted !", ephemeral: true})
                  return
                }
    
                WhitelistUtils.addPlayerToWhitelist(interaction, uuid, username)

                // Logs
                user = await interaction.client.sequelize.models.minecraft_whitelist.findOne({ where: { discord_id: interaction.user.id} })
                if (user) {
                  await user.update({friend_uuid: uuid, friend_pseudo: username})
                } else {
                  await interaction.client.sequelize.models.minecraft_whitelist.create({
                    discord_id: interaction.user.id,
                    friend_uuid: uuid,
                    friend_pseudo: username
                  })
                }

                // Give roles
                let role = await interaction.guild.roles.fetch(process.env.MINECRAFT_FRIEND_WL_ROLE_ID)
                await RoleUtil.giveRoleKnowingRole(interaction.guild, interaction.member, role)
              
                logs.info(interaction.guild,interaction.user,"whitelist_friend_execute","Wl finie : "+username)
                await interaction.reply({content: "Fait !", ephemeral: true})

              });
            }
            https.request(options, callback).end();  

        } catch (error) {
			if(interaction)
				logs.error(interaction.guild,interaction.user,"whitelist_friend_execute",error)
			else
				logs.error(null,null,"whitelist_friend_execute",error)
		}
    }
};