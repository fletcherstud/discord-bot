const { Client, Intents } = require("discord.js");
var logger = require("winston");
require("dotenv").config();
const roleClaim = require("./role-claim");
const memberCount = require("./member-count");

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});

logger.level = "debug";

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  fetchAllMembers: true,
});
bot.once("ready", () => {
  logger.info("Bot is ready!");
  roleClaim(bot);
  memberCount(bot);
});

bot.login(process.env.DISCORD_TOKEN);

const prefix = "!";
const botCommandChannel = "984545597417730128";
bot.on("messageCreate", function (message) {
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    message.channelId !== botCommandChannel
  )
    return; //If its bots message or message does not start with prefix just return

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLocaleLowerCase();
  const guild = bot.guilds.cache.get(process.env.GUILD);
});

bot.on("guildMemberAdd", (member) => {
  logger.info(`${member.user.username} has joined the server`);

  bot.channels.cache
    .find((channel) => channel.id === "984543993608171541")
    .send(
      `Welcome to the server, ${member.user}! Please review our rules <#984539239041605746> to get your role assigned!`
    );
});
