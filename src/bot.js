const client = new Discord.Client();
const cache = {
  events: new Enmap(),
  commands: new Enmap(),
};

fs.readdir(path.resolve(__dirname, "events"), function (err, events) {
  events.forEach((event) => {
    const e = require(path.resolve(__dirname, "events", event));
    cache.events.set(e.name, e);
    client.on(e.name, (...extra) => {
      return cache.events.get(e.name).event(client, ...extra);
    });
  });
});

process.on("unhandledRejection", function (err) {
  if (err.name == "DiscordAPIError") {
    if (err.path && err.path.split("/channels/").length > 1) {
      let channel = client.channels.cache.get(
        err.path.split("/channels/").join("").split("/")[0]
      );
      if (channel) {
        return channel.send(
          process.conf.emojis.err.full +
            " We had an error due to this channel, here's all we know:\n```js\nName: " +
            err.name +
            "\nMessage: " +
            err.message +
            "\nCode: " +
            err.code +
            "```"
        );
      }
    }
  }
  console.error(err);
});

client.login(process.env.TOKEN);

module.exports = cache;
module.exports.client = client;
