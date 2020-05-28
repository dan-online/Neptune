module.exports = {
  aliases: ["manage", "mg", "change"],
  use: process.conf.prefix + "manage <user> +/-<amount>",
  desc: "View your own balance or the balance of someone else",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
  permissions: ["MANAGE_SERVER"],
};
const { parse } = require("../../utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args);
  const amount = parseInt(
    args.find((x) => !isNaN(x) && parseInt(x) < 1000 && parseInt(x) != 0)
  );
  if (!target) throw new Error("You need to specify a user!");
  if (!amount) throw new Error("You need to specify an amount!");
  const targetE = Plugins.economy.init(target, message.guild);
  if (amount > 0) {
    targetE.add(amount);
  } else {
    targetE.remove(amount);
  }
  message.channel.send(
    target.user.tag +
      " now has **" +
      targetE.balance() +
      process.conf.economy.currency +
      "**"
  );
};
