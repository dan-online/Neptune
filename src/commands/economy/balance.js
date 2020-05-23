module.exports = {
  aliases: ["balance", "b"],
  use: process.conf.prefix + "balance",
  desc: "View your own balance or the balance of someone else",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
};
const { parse } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args) || message.member;
  const user = Plugins.economy.init(target, message.guild);
  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setThumbnail(target.user.avatarURL())
    .setTitle("Balance of " + target.user.tag)
    .addField("Account", user.balance + process.conf.economy.currency, true)
    .addField("Position", user.formatPlace, true);
  return message.channel.send(embed);
};
