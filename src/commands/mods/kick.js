module.exports = {
  aliases: ["kick"],
  use: process.conf.prefix + "kick <member>",
  desc: "Kick a Member!",
  disabled: !(process.conf.mods && process.conf.mods.enabled),
  permissions: ["KICK_MEMBERS"],
};
const { parse } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args);
  if (!target) {
    throw new Error("You need to mention a member to kick!");
  }

  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setThumbnail(target.user.avatarURL())
    .setTitle("Balance of " + target.user.tag)
    .addField("Account", user.balance() + process.conf.economy.currency, true)
    .addField("Position", user.position(true), true);
  return message.channel.send(embed);
};
