module.exports = {
  aliases: ["ram", "mem"],
  use: process.conf.prefix + "ram",
  desc: "View memory usage",
};

module.exports.run = async (client, message) => {
  message.channel.send(
    "Ram usage is currently **" +
      Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100 +
      "MB**"
  );
};
