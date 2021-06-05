const ServerModel = require('@data/Schema/server-schema.js');

module.exports = async (client, guild) => {
    if (!(await ServerModel.exists({ _id : guild.id})))
        await ServerModel.create({ _id : guild.id, prefix : client.prefix.default });
    const GuildDb = await ServerModel.findById(guild.id);
    client.prefix[guild.id] = GuildDb.prefix;
    guild.me.setNickname(`${client.user.username} (${GuildDb.prefix})`);
    console.log(`Joined server ${guild.name} (${guild.id}).`);
}