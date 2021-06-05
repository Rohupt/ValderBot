const Discord = require('discord.js');
const {sep} = require('path');
const name = __filename.split(sep)[__filename.split(sep).length - 1].replace(/\.[^/.]+$/, "");
const mod = __dirname.split(sep)[__dirname.split(sep).length - 1];
const aliases = [];

module.exports = {
    name, aliases,
    module: mod,
    channelType: 0, //-1: direct message only, 0: both, 1: guild channel only
    permission: 'everyone',
    userPermissionList: [],
    botPermissionList: [],
    minArguments: 0,
    
    description: 'Get the prefix of the bot. You should only use this when you genuinely forget the prefix.',
    usage: `\`<pingcommand>\``,

    async execute(client, message, args, joined, embed) {
        const prefix = await client.util.commandPrefix(client, message);
        if (message.content.startsWith(prefix))
            return message.reply("Look! It's just somewhere around here!");
        embed.setTitle(`Prefix: \`${prefix}\`.`)
            .setDescription(`You can ping the bot (like, \`@${client.user.tag} prefix\`) to get it again if you forget it.\n`
            + `By the way, couldn't you see it in my nickname?`);

        message.channel.send(embed);
    },
};