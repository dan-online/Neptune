module.exports = {
  aliases: ["ram", "mem"],
  use: process.conf.prefix + "ram",
  desc: "View memory usage",
};
/**
 * This command provides the ram usage of the process
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @alias Ram
 */
async function ramCommand(client, message) {
  message.channel.send(
    "Ram usage is currently **" +
      Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100 +
      "MB**"
  );
}

module.exports.run = ramCommand;
