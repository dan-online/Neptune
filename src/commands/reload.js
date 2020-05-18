module.exports = {
  permissions: ["owner"],
  aliases: ["reload", "rel"],
  use: process.conf.prefix + "reload [cmd/evnt]",
  desc: "Reload a command",
};

module.exports.run = async (client, message, args, { commands, events }) => {
  const cmdToReload = args[0] ? args[0].toLowerCase() : false;
  if (!cmdToReload) throw Error("No command/event given!");
  if (cmdToReload == "*") {
    require("../events/message").loadCommands();
  } else {
    if (commands.get(cmdToReload)) {
      const cmdFile = path.resolve(__dirname, cmdToReload);
      commands.delete(cmdToReload);
      delete require.cache[require.resolve(cmdFile)];
      commands.set(cmdToReload, require(cmdFile));
    } else if (events.get(cmdToReload)) {
      const eventFile = path.resolve(__dirname, "..", "events", cmdToReload);
      events.delete(cmdToReload);
      delete require.cache[require.resolve(eventFile)];
      events.set(cmdToReload, require(eventFile));
    }
  }
  message.react(process.conf.emojis.success.id);
};
