const Discord = require('discord.js');
const {sep} = require('path');
const name = __filename.split(sep)[__filename.split(sep).length - 1].replace(/\.[^/.]+$/, "");
const mod = __dirname.split(sep)[__dirname.split(sep).length - 1];
const aliases = ['q'];

module.exports = {
    name, aliases,
    module: mod,
    channelType: 0, //-1: direct message only, 0: both, 1: guild channel only
    permission: 'everyone',
    userPermissionList: [],
    botPermissionList: ['MANAGE_WEBHOOKS'],
    minArguments: 1,
    
    description: 'Quote a message, using the message ID or link. Click the author name in the embed to go to original message.',
    usage:
        `\`<commandname> <messageId>\` Quote a message within the server\n` +
        `\`<commandname> <link>\` Quote a message using a link, can be from another server the bot is in.\n` +
        `Option \`-n\` can be used (must follow the id or link) to disable bot embed. Original embeds are not affected.`,

    async execute(client, message, args, joined, embed) {
        var quoted = null;
        if (args[0].match(/https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+/)) {
            let subArgs = args[0].split('/').slice(-3);
            let guild = await client.guilds.fetch(subArgs[0]);
            if (!guild) return message.reply('cannot access the guild.');
            let channel = await guild.channels.resolve(subArgs[1]);
            if (!channel) return message.reply('cannot access the channel.');
            quoted = await channel.messages.fetch(subArgs[2]);
        } else {
            await message.channel.messages.fetch(args[0]).then(m => quoted = m).catch(e => {
                if (e.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE)
                    quoted = null;
            });
            if (!quoted) {
                var textChannels = Array.from(message.guild.channels.cache.values()).filter(c => c.type == 'text');
                for (ch in textChannels) {
                    await textChannels[ch].messages.fetch(args[0]).then(m => quoted = m).catch(e => {
                        if (e.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE)
                            quoted = null;
                    });
                    if (quoted) break;
                };
            };
        }
        if (!quoted) return message.reply("no such message found.");

        let image;
        if (quoted.attachments)
            if (Array.from(quoted.attachments.values()).some(a => a.height))
                image = Array.from(quoted.attachments.values()).find(a => a.height);

        embed.setAuthor((quoted.member ? quoted.member.nickname ? quoted.member.nickname : quoted.author.username : quoted.author.username), quoted.author.avatarURL(), quoted.url)
            .setColor(quoted.member ? quoted.member.displayHexColor : 'BLACK')
            .setDescription(quoted.embeds.length > 0 && !quoted.content ? `[Message contains only embed(s), see below]` : quoted.content)
            .setTimestamp(quoted.createdAt)
            .setFooter(quoted.channel.type == 'dm' ? `Direct Message` : `#${quoted.channel.name} @ ${quoted.guild.name}`,
                quoted.channel.type == 'dm' ? quoted.author.avatarURL() : quoted.guild.iconURL());
        if (image) embed.setImage(`${image.url}`);
        
        let webhook = await message.channel.createWebhook(
                message.channel.type == 'dm'
                    ? message.author.username
                    : message.member.nickname
                        ? message.member.nickname : message.author.username,
                message.author.avatarURL());

        webhook.send(args.includes('-n') ? quoted.content : null, [args.includes('-n') ? image : embed, ...quoted.embeds]);
        await message.delete();
        await webhook.delete();
    },
};