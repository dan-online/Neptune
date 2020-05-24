module.exports = {
  aliases: ["ban"],
  use: process.conf.prefix + "ban <member>",
  desc: "Ban a member",
  disabled: !(process.conf.mods && process.conf.mods.enabled),
  permissions: ["BAN_MEMBERS"],
};
const { parse, ask } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args);
  if (!target) {
    throw new Error("You need to mention a member to ban!");
  }

  if (target.hasPermission("BAN_MEMBERS")) {
    throw new Error("You can not ban user who can ban other members!");
  }

  ask(message, "What is the reason for this ban?", undefined, (err, res) => {
    if (err) {
      throw new Error("An error occured!", err.message);
    }
    try {
      target
        .ban(res.content)
        .then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor(process.conf.color)
            .setThumbnail(target.user.avatarURL())
            .setTitle("Banned " + target.displayName)
            .addField("Reason", res.content);
          message.channel.send(embed);
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      throw new Error(err);
    }
  });
};
