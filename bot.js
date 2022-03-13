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
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], fetchAllMembers: true });

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

async function lots_of_users_getter(message, limit = 1000) {
    const sum_users = [];
    let last_id = null;

    while(true) {
        const options = { limit: 100 };
        if (last_id) {
            options.after = last_id;
        }

        const users = await message.reactions.cache.get('945393635913007155').users.fetch(options);
        sum_users.push(...users);
        last_id = users.last().id;

        if (users.size != 100 || sum_users.length >= limit) {
            break;
        }
    }
    return sum_users;
}

const prefix = "!";
const botCommandChannel = '931694376902602793'
bot.on("messageCreate", function(message) {
    if (message.author.bot || !message.content.startsWith(prefix) || message.channelId !== botCommandChannel) return; //If its bots message or message does not start with prefix just return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLocaleLowerCase();
    const guild = bot.guilds.cache.get('930706320930254868');

    if (command === 'getusersreaction') {
        const channel = message.guild.channels.cache.get('931735527571480666') //MUST CHANGE TO THE CHANNEL ID
        let list = []

        console.log('Checking users')
        channel.messages.fetch(args[0]).then(async emojiMessage => {
                const reactedMembers = await lots_of_users_getter(emojiMessage)
                reactedMembers.forEach(member => {list.push(member)})
                console.log(list)
                console.log(list.length)
                const memberIds = new Set(list.map(([id]) => id));
                guild.members.fetch().then(allMembers => {
                    let amountNotReacted = 0
                    let amountReacted = 0
                    for (const member of allMembers) {
                        if(memberIds.has(member[1].user.id)) {
                            amountReacted++
                        } else {
                            if(member[1].user.id === '849358659897262080' || member[1].user.id === '223986960967008256' || member[1].user.id === '224408126546247680' || member[1].user.id === '931682973349191770' || member[1].user.id === '242856962780299266' || member[1].user.id === '298994245497520130') {
                                console.log("Found User: " + member[1].user.username)
                            } else {
                                //TODO: Kick user
                                //await member.kick();
                                amountNotReacted++
                            }
                        }
                    }
                    message.reply(`Amount of members who reacted: ${amountReacted}\nAmount of members who were kicked: ${amountNotReacted}`)
                })
        });
    }
    

    if (command === 'checkallusers') {
        var checkDate = new Date(parseInt(args));
        if(isNaN(checkDate)) {
            message.reply("Please enter a valid date in milliseconds");
            logger.info(`Invalid date was entered: ${args}`);
            
            return;
        }
        var reply = `Here are the users who have created an account after ${checkDate.toString()}:\n`;

        guild.members.fetch()
            .then(members => {
                logger.info(`Checking against ${members.size} members`);
                members.forEach(member => {
                    if ( member.user.createdAt.getTime() > checkDate.getTime()) {
                        if (reply.length > 1000) {
                            message.reply(reply);
                            reply = '';
                        }
                        reply += `<@${member.user.id}>\n`;
                    }
                });
            }).finally(() => {message.reply(reply);});
    }

    if (command === 'removenorole') {
        const ogId = '940073623627137035';
        const teamId = '930712007160786957';
        const dripBotId = '931685062813057085';
        const grapeId = `946136768644796460`;
        const boosterId = '945065449660493875';

        var noRoleList = [];

        if(args != 'amount') {
            message.reply('Removing users from the no role list...');
        }

        guild.members.fetch()
            .then(members => {
                members.forEach(member => {
                    var correctRole = false;
                    member.roles.cache.forEach(role => {
                        if (role.id === ogId || role.id === teamId || role.id === dripBotId || role.id === grapeId || role.id === boosterId) {
                            correctRole = true;
                        }
                    })
                    if (!correctRole) {
                        noRoleList.push(member);
                    }
                });
            }).finally(async () => {
                if(args == 'amount') {
                    message.reply(`Users with no role: ${noRoleList.length}`);
                } else {
                    numberKicked = 0;
                    for (const member of noRoleList) {
                        await member.kick()
                        numberKicked++;
                    }
                    message.reply(`Amount Kicked: ${numberKicked}`)
                }
            })
    }
})

stream.on('tweet', tweet => {
    logger.info(tweet)
    if (tweet.retweeted_status != null || tweet.in_reply_to_status_id != null || tweet.in_reply_to_status_id_str != null || tweet.in_reply_to_user_id != null|| tweet.in_reply_to_user_id_str != null || tweet.in_reply_to_screen_name != null){
        logger.info("Incoming tweet is a reply... ignoring");
        return false;
    } 

    let everyone = bot.guilds.cache.get('930706320930254868').roles.cache.find(role => role.name === "@everyone");
    const twitterMessage = `${everyone} Drip just posted a new tweet! Check it out: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    logger.info('New tweet: ' + twitterMessage);
    bot.channels.cache.get(twitterChanel).send(twitterMessage);
    return false;
});

bot.on('guildMemberAdd', (member) => {
    logger.info(`${member.user.username} has joined the server`);
    const launchDate = new Date(1647295200000); // Date to get OG role
    var today = new Date();

    bot.channels.cache.find(channel => channel.id === "930707460795269151")
        .send(`Welcome to the server, ${member.user}! Please review our rules <#930708332535238676> to get your role assigned!`);

    const ogRoleId = '940073623627137035';
    const dropletId = '930719687539560518';
    setTimeout(() => {
        var correctRole = false;
        member.roles.cache.forEach(role => {
            if(today.getTime() < launchDate.getTime()) {
                if(role.id === ogRoleId) {
                    correctRole = true;
                }
            } else {
                if(role.id === dropletId) {
                    correctRole = true;
                }
            }
        })

        if(!correctRole) {
            logger.info(`${member.user.username} did not accept the rules in the alloted time, kicking...`); 
            member.kick();
        }
    } , 2000 * 60);
});