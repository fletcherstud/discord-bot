const { Client, Intents } = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
const roleClaim = require('./role-claim');
const memberCount = require('./member-count');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

bot.once('ready', () => {
    logger.info('Bot is ready!');
    roleClaim(bot);
    memberCount(bot);
});

bot.login(auth.token);

/*
bot.on('messageCreate', (message) => {
    let messageContent = message.content;
    if (messageContent.substring(0, 1) == '!') {
        var args = messageContent.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                message.channel.send('Pong!');
            break;

            case 'tests':
                message.channel.send('Tests :white_check_mark:');
            break;
        }
    }
});
*/

bot.on('guildMemberAdd', (member) => {
    logger.info(`${member.username} has joined the server`);

    bot.channels.cache.find(channel => channel.id === "930707460795269151")
        .send(`Welcome to the server, ${member.user}! Please review our rules <#930708332535238676> to get your role assigned!`);

});