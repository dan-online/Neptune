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
const { parse } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args);
  const max = process.conf.economy.maxTransfer || 1000;
  const me = Plugins.economy.init(message.member, message.guild);
  const them = Plugins.economy.init(target, message.guild);
  const amount = args.find((x) => !isNaN(x) && 0 < x < max);
  if (!amount)
    throw new Error(
      "Please ensure the balance to transfer is a number and less than " +
        max +
        process.conf.economy.currency
    );
  me.transfer(amount, them);
};
