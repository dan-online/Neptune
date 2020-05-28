module.exports = function (message, commands) {
  let command = message.content
    .toLowerCase()
    .split(process.conf.prefix)[1]
    .split(" ")[0];
  if (!command) {
    return message
      .reply(
        "Hi there! To view my commands run ``" + process.conf.prefix + "help``"
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
  const parsed = {};
  try {
    cmd.use
      .split(" ")
      .filter((x) => /(<([^>]+)>)/gi.test(x))
      .forEach(
        (x, i) => (parsed[x.split("<").join("").split(">").join("")] = args[i])
      );
    args.parsed = parsed; // to-do further
  } catch {} // i don't trust it enough to not throw
  return { args, command, file: cmd };
};
