const { commands, events, database } = require("../bot");
const { testBlock, parseCommand } = require("../utils");
var loaded = false;
function loadCommands() {
  const cmds = fs.readdirSync(path.resolve(__dirname, "..", "commands"));
  cmds.forEach(function command(c) {
    let place = path.resolve(__dirname, "..", "commands", c);
    if (fs.statSync(place).isDirectory()) {
      return fs.readdirSync(place).forEach((newC) => command(c + "/" + newC));
    }
    var cMod;
    try {
      cMod = require(place);
    } catch {}
    if (!cMod || (cMod.disabled && !process.conf.full)) return;
    const category =
      c.split("/")[0][0].toUpperCase() + c.split("/")[0].slice(1);
    cMod.category = category;
    cMod.aliases.forEach((x) => {
      if (commands.get(x)) {
        log.warn("overwriting existing alias: " + x);
      }
      commands.set(x, cMod);
    });
  });
  log.info(commands.size + " commands fully loaded");
}
module.exports = {
  name: "message",
  loadCommands,
  event(client, message) {
    if (!loaded) {
      loadCommands(client);
      loaded = true;
    }
    const returnTest = testBlock(client, message);
    if (!returnTest) return;
    const { file, args } = parseCommand(message, commands);
    if (!file) return;
    if (file.permissions) {
      let noPerms = file.permissions.find((perm) => {
        if (perm == "owner") {
          if (
            typeof process.conf.owner == "string"
              ? message.author.id == process.conf.owner
              : process.conf.owner.find((o) => o == message.author.id)
          ) {
            return false;
          } else {
            return true;
          }
        }
        let f;
        try {
          f = message.member.hasPermission(perm);
        } catch {}
        if (!f) {
          return true;
        }
      });
      if (noPerms) {
        return message.channel.send(
          "Uh oh! You don't have the permission to run this command, permissions needed: " +
            file.permissions.join(" and ")
        );
      }
    }
    function catchErr(err) {
      Sentry.captureException(err);
      if (err.name == "Error") {
        return message.channel.send(
          "Whoops: *" +
            err.message +
            "*\n" +
            "Try running like this: ``" +
            file.use +
            "``"
        );
      }
      log("errr")(err);
      message.channel.send(
        process.conf.emojis.err.full +
          " There was an error on our side: " +
          err.message
      );
    }
    try {
      file
        .run(client, message, args, {
          commands,
          events,
          database,
          plugins: file.plugins,
        })
        .catch((err) => {
          catchErr(err);
        });
    } catch (err) {
      catchErr(err);
    }
  },
};
