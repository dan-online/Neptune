const { commands, events, database } = require("../bot");
const { testBlock, parseCommand } = require("../utils/utils");
var loaded = false;
function loadCommands(client) {
  const cmds = fs.readdirSync(path.resolve(__dirname, "..", "commands"));
  cmds.forEach((c) => {
    const cMod = require(path.resolve(__dirname, "..", "commands", c));
    if (cMod.disabled) return;
    cMod.aliases.forEach((x) => {
      commands.set(x, cMod);
    });
  });
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
        if (
          perm == "owner" &&
          (typeof process.conf.owner == "string"
            ? message.author.id == process.conf.owner
            : process.conf.owner.find((o) => o == message.author.id))
        ) {
          return;
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
      if (err.name == "Error") {
        return message.channel.send(
          "Uh oh! You did something incorrectly!\nProblem: *" +
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
