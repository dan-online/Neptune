module.exports = {
  permissions: ["owner"],
  aliases: ["shutdown", "turnoff"],
  use: process.conf.prefix + "shutdown",
  desc: "Shutdown the bot",
};
/**
 * Destroys the client and then exits the process
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @alias Shutdown
*/
async function shutdownCommand (client, message)  {
  message.channel.send("Bye!").then(() => {
    client.destroy();
    process.exit();
  });
};
module.exports.run = shutdownCommand