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
    
    description: 'Ping the bot to see if it answers or not.',
    usage: `\`<commandname>\``,

    async execute(client, message, args, joined, embed) {
        message.channel.send(embed.setDescription(`Pong! 🏓`)).then((resultMessage) => {
            embed.setDescription(`Pong! 🏓\nBot latency \`${resultMessage.createdTimestamp - message.createdTimestamp}\` ms, API latency: \`${client.ws.ping}\` ms.`);
            resultMessage.edit(embed);
        });
    },
};