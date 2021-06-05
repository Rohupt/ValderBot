const Discord = require('discord.js');
const {sep} = require('path');
const name = __filename.split(sep)[__filename.split(sep).length - 1].replace(/\.[^/.]+$/, "");
const mod = __dirname.split(sep)[__dirname.split(sep).length - 1];
const aliases = [];
const {invite} = require('@data/config.json');

module.exports = {
    name, aliases,
    module: mod,
    channelType: 0, //-1: direct message only, 0: both, 1: guild channel only
    permission: 'everyone',
    userPermissionList: [],
    botPermissionList: [],
    minArguments: 0,
    
    description: 'Get the invite link of the bot',
    usage: `\`<commandname>\``,

    async execute(client, message, args, joined, embed) {
        embed.setTitle('Invite me to your server!')
            .setDescription(`You can use [this link](${invite}) to invite me to your server.`);
        message.channel.send(embed);
    },
};