//https://www.youtube.com/watch?v=bJwPYCy17G4
const firstMessage = require('./first-message');
const { MessageEmbed } = require('discord.js');

module.exports = client => { 
    const channelId = `930708332535238676`

    let emojiText = '1. No spam or self promotion\n2.No doxxing one another\n3.Use the correct channels - ask a moderator for help if needed\n4.Be respectful\n5.No NSFW or obscene content\n6.Report any malicious behaviour to the moderators \n\nAccept our rules by reacting with the checkmark emoji below!\n\n';

    const reactions = ["✅"];

    firstMessage(client, channelId, emojiText, reactions);
    
    const handleReaction = (reaction, user, isAdded) => {
        const member = reaction.message.guild.members.cache.find(member => member.id === user.id);
        if(isAdded) { 
            member.roles.add(`930719687539560518`);
        } else {
            member.roles.remove(`930719687539560518`);
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            if (reaction.emoji.name === `✅`) {
                handleReaction(reaction, user, true);
            }
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            if (reaction.emoji.name === `✅`) {
                handleReaction(reaction, user, false);
            }
        }
    });
}