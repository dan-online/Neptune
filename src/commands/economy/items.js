module.exports = {
  aliases: ["items", "its"],
  use: process.conf.prefix + "items",
  desc: "View items in the shop",
  disabled: true,
};
const {
  ask
} = require("../../utils");
module.exports.run = async (client, message, args) => {
  const guildCustom = Plugins.economy.initGuild(message.guild);
  const items = guildCustom.items();
  (function askThem(page = 1) {
    const pages = Math.round(items.length / 9 - 0.6) + 1;
    if (isNaN(page) || page > pages || page < 1) page = 1;
    const embed = new Discord.MessageEmbed()
      .setColor(process.conf.color)
      .setFooter(`Page ${page}/${pages} Send what page you would like to see`);
    items.slice(page * 9 - 9, pages * 9).forEach((item) => {
      embed.addField(item.name, item.description, true);
    });
    ask(
      message,
      embed,
      Array(pages)
      .fill("")
      .map((x, i) => String(i + 1)),
      function (err, reply, myMessage) {
        if (err) throw err;
        reply.delete().then(() => {
          if (myMessage)
            myMessage.delete().then(() => {
              askThem(reply.content);
            });
        });
      }
    ).then((m) => {
      myMessage = m;
    });
  })();
};