const Discord = require('discord.js');
const {sep} = require('path');
const name = __filename.split(sep)[__filename.split(sep).length - 1].replace(/\.[^/.]+$/, "");
const mod = __dirname.split(sep)[__dirname.split(sep).length - 1];
const aliases = ['sp'];

const ejf = require('edit-json-file');
const ServerModel = require('@data/Schema/server-schema.js');

module.exports = {
    name, aliases,
    module: mod,
    channelType: 0, //-1: direct message only, 0: both, 1: guild channel only
    permission: 'administrator',
    userPermissionList: [],
    botPermissionList: [],
    minArguments: 1,
    
    description: 'Set the prefix of the bot.',
    usage: `\`<commandname> <prefix>\` Set the prefix to <prefix>`,

    async execute(client, message, args, joined, embed) {
        const isDM = message.channel.type == 'dm';
        
        if (isDM)
            return (message.channel.send(embed.setDescription('You cannot change the prefix in direct message channel.')));

        const newprefix = args[0];
        if (await ServerModel.exists({ _id : message.guild.id}))
            await ServerModel.updateOne({ _id : message.guild.id }, { prefix : newprefix });
        else await ServerModel.create({ _id : message.guild.id, prefix : newprefix});
        client.prefix[message.guild.id] = newprefix;
        embed.setDescription(`Prefix changed to \`${newprefix}\` for this server`);
        message.channel.send(embed);
        message.guild.me.setNickname(`${client.user.username} (${newprefix})`);
    },
};