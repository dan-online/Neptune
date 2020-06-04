module.exports = {
  permissions: ["owner"],
  aliases: ["shutdown", "turnoff"],
  use: process.conf.prefix + "shutdown",
  desc: "Shutdown the bot",
};
module.exports.run = async (client, message, args, extras) => {
  message.channel.send("Bye!").then(() => {
    client.destroy();
    process.exit();
  });
};
