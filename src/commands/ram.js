module.exports.run = async (client, message) => {
  message.channel.send(
    "Ram usage is currently **" +
      Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100 +
      "MB**"
  );
};
module.exports.aliases = ["ram", "mem"];
module.exports.use = process.conf.prefix + "ram";
module.exports.desc = "View memory usage";
