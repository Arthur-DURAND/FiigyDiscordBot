const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const logs = require('../../Utils/Logs.js');
const WhitelistUtils = require('../../Interactables/Whitelist/whitelist_utils.js')
var https = require('https');
const RoleUtil = require('../../Utils/RoleUtil.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName("instant_whitelist")
		.setDescription("Whitelist un joueur. (Bypass la vérification d'email)")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription("L'utilisateur à whitelist")
				.setRequired(true))
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription("Le username de l'utilisateur minecraft à whitelist")
                .setRequired(true)),
		/**
		 * 
		 * @param {CommandInteraction} interaction
		 */
		async execute(interaction) {

            try {

                if(!interaction.guild)
                    console.log("Error instant_whitelist : interaction.guild is null")

                if(!interaction.channel)
                    logs.error(interaction.guild,interaction.user,"instant_whitelist","interaction.channel is null")

                if(!interaction.options)
                    logs.error(interaction.guild,interaction.user,"instant_whitelist","interaction.options is null")

                logs.debug(interaction.guild,interaction.user,"instant_whitelist",null)

                const user = interaction.options.getUser('user');
                const member = await interaction.guild.members.fetch(user)
                const roles = member.roles.cache

                let has_wl = false
                for(let role of roles){
                    if(role[0] == process.env.MINECRAFT_WL_ROLE_ID){
                        has_wl = true
                        if(interaction.channel){
                            await interaction.reply({ content: "Cet utilisateur est déjà whitelisted !", ephemeral: true })
                            return
                        }
                    }
                }

                const username = interaction.options.getString('username');

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
                        await interaction.reply({content: "Ce nom d'utilisateur Minecraft n'existe pas !", ephemeral: true})
                        return
                    }
                    uuid = [uuid.slice(0, 8), "-", uuid.slice(8, 12), "-", uuid.slice(12, 16), "-", uuid.slice(16, 20), "-", uuid.slice(20)].join('')
    
                    if(await WhitelistUtils.isInDatabase(interaction, uuid)){
                        await interaction.reply({content: "Cet utilisateur Minecraft est déjà whitelisted !", ephemeral: true})
                        return
                    }
        
                    WhitelistUtils.addPlayerToWhitelist(interaction, uuid, username)
        
                    // Write data
                    db_user = await interaction.client.sequelize.models.minecraft_whitelist.findOne({ where: { discord_id: user.id} })
                    if (db_user) {
                        await db_user.update({uuid: uuid, pseudo: username})
                    } else {
                        await interaction.client.sequelize.models.minecraft_whitelist.create({
                        discord_id: user.id,
                        uuid: uuid,
                        pseudo: username
                        })
                    }
    
                    // Give roles
                    let role = await interaction.guild.roles.fetch(process.env.MINECRAFT_WL_ROLE_ID)
                    await RoleUtil.giveRoleKnowingRole(interaction.guild, member, role)
                    
                    await interaction.reply({content: "Fait !", ephemeral: true})
                    
                    });
                }
                https.request(options, callback).end();

            } catch (error) {
                logs.error(interaction.guild,interaction.user,"instant_whitelist",error)
            }

		}
}