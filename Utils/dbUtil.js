const Sequelize = require('sequelize');

class dbUtil {
    static sequelize = null; 

    static connectionInstance() {
        if(this.sequelize == null){
            this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'mariadb'
            })
        }
        return this.sequelize;
    }

    static async testConnection(sequelize) {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    static async syncTables(sequelize) {
        // EMAILS
        sequelize.define('user', {
            discord_id: {
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            email_perso: {
                type: Sequelize.STRING,
                defaultValue: null
            }
        }, {
            tableName: 'User',
            timestamps: false
        });

        // MINECRAFT WL
        sequelize.define('minecraft_whitelist', {
            discord_id: {
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true
            },
            uuid: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            pseudo: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            friend_uuid: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            friend_pseudo: {
                type: Sequelize.STRING,
                defaultValue: null
            },
        }, {
            tableName: 'MinecraftWhitelist',
            timestamps: false
        });

        // EASTER EGGS MINECRAFT
        sequelize.define('easter_eggs', {
            discord_id: {
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true
            },
            eggs_data: {
                type: Sequelize.STRING,
                defaultValue: ""
            }
        }, {
            tableName: 'EasterEggs',
            timestamps: false
        });

        // TODO DISCORD GAMES
        
        sequelize.sync()

    }

}

module.exports = dbUtil;