var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var commands = require('./commands.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: '!ping - pong!'
                });
            break;

            default:
                bot.sendMessage({
                    to: channelID,
                    message: `Command not found!\n Here are the commands:\n ${JSON.stringify(commands)}\n`
                });
        }
    }
});

bot.on('guildMemberAdd', function (member) {
    bot.sendMessage({
        to: '930707460795269151',
        message: `Welcome to the server, ${member.username}!`
    });
});