module.exports = {
  aliases: ["items", "its"],
  use: process.conf.prefix + "items",
  desc: "View items in the shop",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
};
const { ask } = require("../../utils");
module.exports.run = async (client, message, args) => {
  const guildCustom = Plugins.economy.initGuild(message.guild);
  const items = guildCustom.items();
  (function askThem(page = 1) {
    const pages = Math.round(items.length / 10) + 1;
    if (isNaN(page) || page > pages || page < 1) page = 1;
    const embed = new Discord.MessageEmbed()
      .setColor(process.conf.color)
      .setFooter(`Page ${page}/${pages} Send what page you would like to see`);
    items.slice(page * 10 - 10, pages * 10).forEach((item) => {
      embed.addField(item.name, item.description, true);
    });
    ask(message, embed, undefined, function (err, reply, myMessage) {
      if (err) throw err;
      reply.delete().then(() => {
        if (myMessage)
          myMessage.delete().then(() => {
            askThem(reply.content);
          });
      });
    }).then((m) => {
      myMessage = m;
    });
  })();
};
