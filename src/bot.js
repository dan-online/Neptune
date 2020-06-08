// const client = new Discord.Client();
class Neptune extends Discord.Client {
  events = new Enmap();
  commands = new Enmap();
  constructor() {
    super();
    fs.readdir(path.resolve(__dirname, "events"), (err, evnts) => {
      let events = [];
      evnts.forEach((e) => {
        const file = require(path.resolve(__dirname, "events", e));
        let ind = events.findIndex((x) => x.name == file.name);
        if (ind < 0) {
          events.push({ name: file.name, callers: [file] });
        } else {
          events[ind].callers.push(file);
        }
      });
      events.forEach((event) => {
        this.events.set(event.name, event.callers);
        this.on(event.name, (...extra) => {
          return this.events
            .get(event.name)
            .forEach((e) => e.event(this, ...extra));
        });
      });
    });
    this.login(process.env.TOKEN);
  }
}

const client = new Neptune();

process.on("unhandledRejection", function (err) {
  Sentry.captureException(err);
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

module.exports = client;
