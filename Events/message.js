const {pickRandom} = require('mathjs');
const replies = require('@data/replies.json');

function getArgs(message) {
    var doubleDoubleQuote = '<DDQ>', spaceMarker = '<SP>', newLineMarker = '<NL>', tabMarker = '<T>';
    while (message.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += '@';
    while (message.indexOf(spaceMarker) > -1) spaceMarker += '@';
    while (message.indexOf(newLineMarker) > -1) newLineMarker += '@';
    while (message.indexOf(tabMarker) > -1) tabMarker += '@';

    // Replace double double quotes with markers
    const ddqReplaced = message.replace( /""/g, doubleDoubleQuote);
    // Replace spaces, tabs, newlines in double-quoted args with markers; and ddq markers with single dq
    const whitespacesReplaced = ddqReplaced.replace(/"([^"]*)"?/g, (fullMatch, capture) => {
        return capture
            .replace(/ /g, spaceMarker)
            .replace(/\t/g, tabMarker)
            .replace(/\n/g, newLineMarker)
            .replace(RegExp(doubleDoubleQuote, 'g'), '"');
    });
    // Split the arguments
    const mangledParams = whitespacesReplaced.trim().split(/[ \n\t]+/);
    // Change the markers back to whitespaces; remove any ddq left
    return mangledParams.map((mangledParam) => {
        return mangledParam
            .replace(RegExp(spaceMarker, 'g'), ' ')
            .replace(RegExp(tabMarker, 'g'), '\t')
            .replace(RegExp(newLineMarker, 'g'), '\n')
            .replace(RegExp(doubleDoubleQuote, 'g'), '');
    });
}

function getCommandAndArgs(client, message, prefix) {
    const actualPrefix = message.content.startsWith(prefix) ? prefix : `<@!${client.user.id}>`;
    const args = getArgs(message.content.slice(actualPrefix.length));
    const commandName = args.shift();
    const joined = message.content.replace(RegExp(actualPrefix + /[ \n\t]*/.source + commandName + /[ \n\t]*/.source, 'i'), '');
    const command = client.commands.get(client.calls.get(commandName.toLowerCase()));
    return {command, args, joined};
}

function commandLog(message, command, args, joined) {
    const isDM = message.channel.type == 'dm';
    return console.log(`\n\nCommand received: ${command.name}\n`
        + `Guild\t\t: ${isDM ? 'None' : message.guild.name}${!isDM ? ' (' + message.guild.id + ')' : ''}\n`
        + `Channel\t\t: ${isDM ? 'Direct Message' : message.channel.name} (${message.channel.id})\n`
        + `Caller\t\t: ${message.author.tag} (${message.author.id})\n`
        + `Time\t\t: ${message.createdAt.toString()}\n`
        + `Arguments\t: [${args.map(arg => arg.replace('\n', '\\n').replace('\t', '\\t')).join(', ')}]\n`
        + `Joined Args\t: {${joined}}\n`);
}

function checkChannel(message, command, embed) {
    if ((message.channel.type == 'dm' && command.channelType == 1) || (message.channel.type != 'dm' && command.channelType == -1)) {
        message.channel.send(embed.setDescription('You cannot use that command here. Please refer to `help` for more details.'));
        return false;
    }
    return true;
}

function checkUserPermission(message, command) {
    switch (command.permission) {
        case 'developer':
            return (message.author.id == config.ownerID);
        case 'owner':
            return (message.member == message.guild.owner);
        case 'administrators':
            return (message.member.hasPermission('ADMINISTRATOR'));
        case 'moderators':
            return (message.guild.id == tlg.id
                ? message.member.roles.cache.find(r => r.id == tlg.modRoleID)
                    || message.member.hasPermission('ADMINISTRATOR')
                : message.member.hasPermission('ADMINISTRATOR'));
        case 'dungeonmasters':
            return (message.guild.id == tlg.id
                ? message.member.roles.cache.find(r => r.id == tlg.dmRoleID)
                    || message.member.roles.cache.find(r => r.id == tlg.modRoleID)
                    || message.member.hasPermission('ADMINISTRATOR')
                : message.member.hasPermission('ADMINISTRATOR'));
        case 'role':
            
            break;
        case 'special':
            return (message.member.hasPermission(command.userPermissionList, {checkAdmin: true, checkOwner: true}));
        case 'everyone':
            return true;
        default:
            return (message.author.id == config.ownerID);
    }
}

function checkBotPermission(message, command, embed) {
    if (message.channel.type == 'dm') return true;
    if (!message.guild.me.hasPermission(command.botPermissionList, {checkAdmin: true, checkOwner: true})) {
        embed.setDescription('Cannot execute the command because the bot lacks the following permissions:\n'
            + `\`${command.botPermissionList.filter(p => !message.guild.me.permissions.toArray().includes(p)).join('`, `')}\``);
        message.channel.send(embed);
        return false;
    };
    return true;
}

async function executeCommand(client, message) {
    if (message.author.bot) return;
    //check prefix
    var prefix = await client.util.commandPrefix(client, message);
    if ((!message.content.startsWith(`<@!${client.user.id}>`) && !message.content.startsWith(prefix)) || (message.content.startsWith(prefix + ' '))) return;
    
    //check developerMode
    let config = client.util.reloadFile('@data/config.json');
    if (config.developerMode && message.author.id != config.ownerID)
        return message.reply(pickRandom(replies.developerMode));
    
    //get command
    var {command, args, joined} = getCommandAndArgs(client, message, prefix);
    if (!command) return;
    commandLog(message, command, args, joined);

    //check channel type
    let embed = client.util.newReturnEmbed(message);
    if (!checkChannel(message, command, embed)) return;
    
    //check number of arguments
    if (args.length < command.minArguments) {
        embed.setDescription(`There are not enough arguments to execute that command.\n`
            + `You provided \`${args.length}\` arguments, but \`${command.minArguments}\` ${command.minArguments > 1 ? 'are' : 'is'} needed.`);
        return message.channel.send(embed);
    }
    
    //check permissions
    if (!checkUserPermission(message, command, config))
        return message.reply(pickRandom(replies[command.permission]));
    if (!checkBotPermission(message, command, embed)) return;
    
    try {
        command.execute(client, message, args, joined, embed);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
}

module.exports = async (client, message) => {
    await executeCommand(client, message);
}