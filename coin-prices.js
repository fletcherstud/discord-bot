const fetch = require('cross-fetch')
const channelMap = require('./coin-channel.json');

module.exports = async (client, coin) => {
    const guild = client.guilds.cache.get('930706320930254868');
    const channel = guild.channels.cache.get(channelMap[coin]);
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();

    console.log(`Current price for coin ${coin}: ${data[coin].usd.toFixed(2)}`);

    channel.setName(`${coin}: ${data[coin].usd.toFixed(2)}`);
}