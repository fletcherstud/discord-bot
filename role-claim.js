//https://www.youtube.com/watch?v=bJwPYCy17G4
const firstMessage = require('./first-message');
const { MessageEmbed } = require('discord.js');

module.exports = client => { 
    const channelId = `930708332535238676`
    const launchDate = new Date(1647568840000); // Date to get OG role
    let emojiText = '1. No spam or self promotion\n2. No doxxing one another\n3. Use the correct channels - ask a moderator for help if needed\n4. Be respectful\n5. No NSFW or obscene content\n6. Report any malicious behaviour to the moderators \n\nAccept our rules by reacting to our custom emoji below!\n\n';
    const emoji = client.emojis.cache.get("945393635913007155");
    const reactions = [emoji.toString()];

    firstMessage(client, channelId, emojiText, reactions);
    
    const handleReaction = (reaction, user, isAdded) => {
        const member = reaction.message.guild.members.cache.find(member => member.id === user.id);
        var today = new Date();
  
        if(isAdded) {
            if(today.getTime() < launchDate.getTime()) {
                member.roles.add(`940073623627137035`); //Add OG role
            } else {
                member.roles.add(`930719687539560518`); //Add Drop role               
            }
        } else {
            if(today.getTime() < launchDate.getTime()) {
                member.roles.remove(`940073623627137035`); //Add OG role
            } else {
                member.roles.remove(`930719687539560518`); //Remove Drop role               
            }
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            if (reaction.emoji === emoji) {
                handleReaction(reaction, user, true);
            }
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            if (reaction.emoji === emoji) {
                handleReaction(reaction, user, false);
            }
        }
    });
}