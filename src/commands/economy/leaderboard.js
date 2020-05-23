module.exports = {
  aliases: ["leaderboard", "lb"],
  use: process.conf.prefix + "balance",
  desc: "View your own balance or the balance of someone else",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
};
const { parse } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const target = parse.member(client, message, args) || message.member;
  const targetE = Plugins.economy.init(target, message.member);
  var members = [];
  message.guild.members.cache.forEach((x) => {
    if (x.user.bot) return;
    const E = Plugins.economy.init(x, message.guild);
    members.push(E);
  });
  members = members.sort((a, b) => a.position() - b.position());
  members.slice(0, 10);
  message.channel.send(`\`\`\`asciidoc
= Leaderboard of ${message.guild.name} =
  
${members
  .map(
    (x) =>
      `${x.position(true)}. ${x.member.displayName}\n   ${x.balance()}${
        process.conf.economy.currency
      }`
  )
  .join("\n")}

= ${targetE.position(true)}. ${target.displayName} - ${
    targetE.balance() + process.conf.economy.currency
  } =\`\`\`
  `);
};
