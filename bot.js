const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
var Twit = require('twit');
var logger = require('winston');
var auth = require('./auth.json');
var twitAuth = require('./twitter.json');
const roleClaim = require('./role-claim');
const memberCount = require('./member-count');
const Twitter = require('twit');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

const twitterConf = {
    consumer_key: twitAuth.consumer,
    consumer_secret: twitAuth.consumer_secret,
    access_token: twitAuth.access,
    access_token_secret: twitAuth.access_secret
}

const twitterClient = new Twitter(twitterConf);
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

bot.once('ready', () => {
    logger.info('Bot is ready!');
    roleClaim(bot);
    memberCount(bot);
});

bot.login(auth.token);

const twitterChanel = '931736578907336714';
const stream = twitterClient.stream('statuses/filter', {
    follow: '1479956858949431296'
});

stream.on('tweet', tweet => {
    let everyone = bot.guilds.cache.get('930706320930254868').roles.cache.find(role => role.name === "@everyone");
    const twitterMessage = `${everyone} Drip just posted a new tweet! Check it out: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    logger.info('New tweet: ' + twitterMessage);
    bot.channels.cache.get(twitterChanel).send(twitterMessage);
    return false;
});

bot.on('guildMemberAdd', (member) => {
    logger.info(`${member.username} has joined the server`);

    bot.channels.cache.find(channel => channel.id === "930707460795269151")
        .send(`Welcome to the server, ${member.user}! Please review our rules <#930708332535238676> to get your role assigned!`);

});