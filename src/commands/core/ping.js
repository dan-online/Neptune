module.exports = {
  aliases: ["ping", "pong", "p"],
  use: process.conf.prefix + "ping",
  desc: "Check the speed of the bot",
};

module.exports.run = async (client, message) => {
  message.channel.send("PONG").then((m) => {
    m.edit(
      "Pong!\nMessage: **" +
        (m.createdAt - message.createdAt) +
        "ms**\nDiscord: **" +
        client.ws.ping +
        "ms**\nCreate: **" +
        (new Date() - m.createdAt) +
        "ms**"
    );
  });
};
