const config = require('@data/config.json');
const mongoose = require('@util/mongoose.js');

module.exports = (client) => {
    client.db = mongoose();
    console.log(`Connected as ${client.user.tag}\t(time: ${process.uptime()}s)`);
    client.user.setActivity(`${config.developerMode ? 'the dev only' : 'everyone'}`, {type: 'LISTENING'});
};