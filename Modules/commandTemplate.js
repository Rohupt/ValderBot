const Discord = require('discord.js');
const {sep} = require('path');
const name = __filename.split(sep)[__filename.split(sep).length - 1].replace(/\.[^/.]+$/, "");
const mod = __dirname.split(sep)[__dirname.split(sep).length - 1];
const aliases = [];

module.exports = {
    name, aliases,
    module: mod,
    channelType: 0, //-1: direct message only, 0: both, 1: guild channel only
    permission: '',
    userPermissionList: [],
    botPermissionList: [],
    minArguments: 0,
    
    description: '',
    usage: `\`<commandname>\``,

    async execute(client, message, args, joined, embed) {
        
    },
};