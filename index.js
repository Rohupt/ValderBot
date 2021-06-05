require('module-alias/register');
const Discord = require('discord.js');
const config = require('@data/config.json');
const util = require('@util/utilities.js');
const watcher = require('./watcher.js');

var client = new Discord.Client();
client.commands = new Discord.Collection();
client.calls = new Discord.Collection();
client.events = new Discord.Collection();
client.token = config.token;
client.prefix = {default: config.defaultPrefix};
client.util = util;
client.login(client.token);

watcher.execute(client);