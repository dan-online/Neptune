module.exports = {
  aliases: ["transfer", "t"],
  use: process.conf.prefix + "transfer <balance> <target>",
  desc:
    "Transfer " +
    (process.conf.economy && process.conf.economy.currency
      ? process.conf.economy.currency
      : "coins") +
    " to another person",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
};

module.exports.run = async (client, message, args) => {
  const user = Plugins.economy.init(message.author, message.guild);
  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setThumbnail(message.author.avatarURL())
    .setTitle("Balance of " + message.author.tag)
    .addField("Account", user.balance() + process.conf.economy.currency, true)
    .addField("Position", user.position(true), true);
  return message.channel.send(embed);
};
