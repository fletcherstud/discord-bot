const { Client, Intents } = require('discord.js');
var logger = require('winston');
require('dotenv').config();
const roleClaim = require('./role-claim');
const memberCount = require('./member-count');
const coinPrices = require('./coin-prices');
const Twitter = require('twit');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

const twitterConf = {
    consumer_key: process.env.TWITTER_CONSUMER,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
}

const twitterClient = new Twitter(twitterConf);
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

bot.once('ready', () => {
    logger.info('Bot is ready!');
    roleClaim(bot);
    memberCount(bot);
    setInterval(() => {
        coinPrices(bot, 'solana');
        coinPrices(bot, 'serum');
    }, 60000 * 5);
});

bot.login(process.env.DISCORD_TOKEN);

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