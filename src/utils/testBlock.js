module.exports = function (client, message) {
  if (!message.guild) {
    return;
  }

  if (message.author.bot || message.author.id == client.user.id) return false;
  if (
    message.mentions.members.first() &&
    message.mentions.members.first().id == client.user.id
  ) {
    message.channel.send(
      "Hi there! To view my commands run ``" + process.conf.prefix + "help``"
    );
    return false;
  }
  if (
    !message.content
    .toLowerCase()
    .split(" ")
    .join("")
    .startsWith(process.conf.prefix)
  ) {
    return false;
  }
  return true;
};