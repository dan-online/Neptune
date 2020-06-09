module.exports = {
  permissions: ["owner"],
  aliases: ["reload", "rel"],
  use: process.conf.prefix + "reload [cmd/evnt]",
  desc: "Reload a command",
};

module.exports.run = async (client, message, args, { commands, events }) => {
  const cmdToReload = args[0] ? args[0].toLowerCase() : false;
  if (!cmdToReload) throw Error("No command/event given!");
  if (commands.get(cmdToReload)) {
    commands.delete(cmdToReload);
    require("../../events/message").loadCommands();
  } else if (events.get(cmdToReload)) {
    const eventFile = path.resolve(__dirname, "..", "events", cmdToReload);
    events.delete(cmdToReload);
    delete require.cache[require.resolve(eventFile)];
    events.set(cmdToReload, require(eventFile));
  }
  message.react(process.conf.emojis.success.id);
};
