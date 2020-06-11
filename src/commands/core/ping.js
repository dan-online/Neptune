module.exports = {
  aliases: ["ping", "pong", "p"],
  use: process.conf.prefix + "ping",
  desc: "Check the speed of the bot",
};
/**
 * This command provides the speed of the connection to discord's servers
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @alias Ping
*/
async function pingCommand(client, message)  {
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

module.exports.run = pingCommand
