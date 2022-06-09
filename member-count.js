require("dotenv").config();

module.exports = async (client) => {
  const guild = client.guilds.cache.get(process.env.GUILD);
  setInterval(() => {
    const channelTicker = guild.channels.cache.get("984548776486252625");
    var memberCount = guild.memberCount;

    channelTicker.setName(`Members: ${memberCount}`);
  }, 60000);
};
