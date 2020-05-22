module.exports = {
  aliases: ["balance", "b"],
  use: process.conf.prefix + "balance",
  desc: "View your own balance or the balance of someone else",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
};
const { parse } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const user =
    parse.user(client, message, args) ||
    Plugins.economy.init(message.author, message.guild);
  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setThumbnail(message.author.avatarURL())
    .setTitle("Balance of " + message.author.tag)
    .addField("Account", user.balance() + process.conf.economy.currency, true)
    .addField("Position", user.position(true), true);
  return message.channel.send(embed);
};
