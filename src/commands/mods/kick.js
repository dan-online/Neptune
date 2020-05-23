module.exports = {
  aliases: ["kick"],
  use: process.conf.prefix + "kick <member>",
  desc: "Kick a Member!",
  disabled: !(process.conf.mods && process.conf.mods.enabled),
  permissions: ["KICK_MEMBERS"],
};
const { parse, ask } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  console.log(args);
  // ahh yea just do args.filter(x => x.content != wait no idk how, good luck
  // we gotta add a reason to kick
  const target = parse.member(client, message, args);
  console.log(target.toString());

  if (!target) {
    throw new Error("You need to mention a member to kick!");
  }
  console.log(target.permissions.toArray());

  if (target.hasPermission("KICK_MEMBERS")) {
    throw new Error("You can not kick user who can kick other members!");
  }

  try {
    ask(message, "What is the reason for kicking?", undefined, (err, res) => {
      if (err) {
        throw new Error("An error occured!", err.toString());
      }
      try {
        target
          .kick(res.content)
          .then(() => {
            const embed = new Discord.MessageEmbed()
              .setColor(process.conf.color)
              .setThumbnail(target.user.avatarURL())
              .setTitle(target.displayName, "kicked!")
              .addField("Reason", res.content);
            message.reply(embed);
          })
          .catch((err) => {
            throw new Error(err);
          });
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    throw new Error(err);
  }

  //   const embed = new Discord.MessageEmbed()
  //     .setColor(process.conf.color)
  //     .setThumbnail(target.user.avatarURL())
  //     .setTitle("Balance of " + target.user.tag)
  //     .addField("Account", user.balance() + process.conf.economy.currency, true)
  //     .addField("Position", user.position(true), true);
  //   return message.channel.send(embed);
};
