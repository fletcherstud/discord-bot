module.exports = async (client) => {
    const guild = client.guilds.cache.get('930706320930254868');
    setInterval(() => {
        const channelTicker = guild.channels.cache.get("933609699083960350");
        var memberCount = guild.memberCount;

        channelTicker.setName(`Members: ${memberCount}`);
    }, 60000);
}