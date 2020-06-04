module.exports = {
  aliases: ["additem", "add-item", "addi"],
  use: process.conf.prefix + "additem <name>",
  desc: "Add an item to the guilds items store",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
  permissions: ["MANAGE_SERVER"],
};
const { ask } = require("../../utils");
module.exports.run = async (client, message, args) => {
  const name = args.join(" ");
  const guildCustom = Plugins.economy.initGuild(message.guild);
  const items = guildCustom.items();
  ask(
    message,
    ":tada: What description should **" + name + "** have?",
    null,
    function (err, description) {
      if (!description || err || description.content == "cancel")
        return message.channel.send("Item addition canceled!");
    }
  );
};
