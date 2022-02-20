const fetch = require('cross-fetch')
const channelMap = require('./coin-channel.json');
var logger = require('winston');

module.exports = async (client, coin) => {
    const guild = client.guilds.cache.get('930706320930254868');
    const channel = guild.channels.cache.get(channelMap[coin]);
    var data = ''
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
        data = await response.json();
    }
    catch (error) {
        console.log(`There was an error fetching ${coin} data: \n`, error);
    }
    finally {
        logger.info(`${coin} price: ${data[coin].usd.toFixed(2)}`);
        channel.setName(`${coin}: $${data[coin].usd.toFixed(2)}`);
    }
}