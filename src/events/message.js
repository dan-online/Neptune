const { commands, events, database } = require("../bot");
function loadCommands() {
  fs.readdir(path.resolve(__dirname, "..", "commands"), function (err, cmds) {
    cmds.forEach((c) => {
      const cMod = require(path.resolve(__dirname, "..", "commands", c));
      cMod.aliases.forEach((x) => {
        commands.set(x, cMod);
      });
    });
  });
}
loadCommands();
module.exports = {
  name: "message",
  loadCommands,
  event(client, message) {
    if (message.author.bot || message.author.id == client.user.id) return;
    if (
      message.mentions.members.first() &&
      message.mentions.members.first().id == client.user.id
    ) {
      return message.reply(
        "Hi there! To view my commands run ``" + process.conf.prefix + "help``"
      );
    }
    if (
      !message.content
        .toLowerCase()
        .split(" ")
        .join("")
        .startsWith(process.conf.prefix)
    ) {
      return;
    }
    let command = message.content
      .toLowerCase()
      .split(process.conf.prefix)[1]
      .split(" ")[0];
    if (!command) {
      return message
        .reply(
          "Hi there! To view my commands run ``" +
            process.conf.prefix +
            "help``"
        )
        .catch(() => {});
    }
    command = command.toLowerCase();
    let cmd;
    try {
      cmd = commands.get(command);
    } catch {}
    if (!cmd) {
      return message.reply(
        "``" +
          command +
          "`` was not found! Try running " +
          process.conf.prefix +
          "help to find a command!"
      );
    }
    const args = message.content.split(" ").slice(1);
    if (cmd.permissions) {
      let noPerms = cmd.permissions.find((perm) => {
        if (perm == "owner" && message.author.id == process.conf.owner) {
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
            cmd.permissions.join(" and ")
        );
      }
    }
    function catchErr(err) {
      if (err.name == "Error") {
        return message.channel.send(
          "Uh oh! You did something incorrectly! Try running like this: ``" +
            cmd.use +
            "``\n\nProblem: **" +
            err.message +
            "**"
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
      cmd
        .run(client, message, args, { commands, events, database })
        .catch((err) => {
          catchErr(err);
        });
    } catch (err) {
      catchErr(err);
    }
  },
};
