const ServerModel = require('@data/Schema/server-schema.js');

module.exports = async (client, guild) => {
    if ((await ServerModel.exists({ _id : guild.id})))
        await ServerModel.deleteOne({ _id : guild.id });
    console.log(`Left server ${guild.name} (${guild.id}).`);
}