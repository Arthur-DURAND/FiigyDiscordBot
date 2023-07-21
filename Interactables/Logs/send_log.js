
const logs = require('../../Utils/Logs.js');

module.exports = {
	name: "send_log",
	async execute(interaction) {

        logs.debug(interaction.guild,interaction.user,"send_log",null)

        let log = null
        if(interaction.fields)
            log = interaction.fields.getTextInputValue('log');


        interaction.channel.send({ content: log })
    
    }
};