//https://www.youtube.com/watch?v=bJwPYCy17G4
const firstMessage = require("./first-message");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  const channelId = `984539239041605746`;
  let emojiText =
    "1. Be Chill\n2. Do Not Not Be Chill\n\nAccept our rules by reacting to our custom emoji below!\n\n";
  const emoji = client.emojis.cache.get("984551350148947989");
  const reactions = [emoji.toString()];

  firstMessage(client, channelId, emojiText, reactions);

  const handleReaction = (reaction, user, isAdded) => {
    const member = reaction.message.guild.members.cache.find(
      (member) => member.id === user.id
    );

    if (isAdded) {
      member.roles.add("984541826147049522"); //Add Stud
    } else {
      member.roles.remove("984541826147049522"); //Remove Stud
    }
  };

  client.on("messageReactionAdd", (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      if (reaction.emoji === emoji) {
        handleReaction(reaction, user, true);
      }
    }
  });

  client.on("messageReactionRemove", (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      if (reaction.emoji === emoji) {
        handleReaction(reaction, user, false);
      }
    }
  });
};
