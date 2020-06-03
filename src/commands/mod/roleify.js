module.exports = {
  aliases: ["addroles", "roleify", "massroles"],
  use: process.conf.prefix + "roleify <role>",
  desc: "Add a role to everyone in the server",
  disabled: !(process.conf.mods && process.conf.mods.enabled),
  permissions: ["MANAGE_GUILD"],
};
const { parse, ask } = require("../../utils/utils");
module.exports.run = async (client, message, args) => {
  const role = parse.role(client, message, args);
  if (!role) {
    throw new Error("No role specified");
  }
  const members = message.guild.members.cache.filter(
    (x) => !x.user.bot && !x.hasPermission("MANAGE_GUILD")
  );
  if (!args.find((x) => x == "YES")) {
    return message.channel.send(
      "To add **" +
        role.name +
        "** to " +
        members.size +
        " members, run this command again with ``YES``"
    );
  }
  message.channel
    .send("Please wait while we add this role to everyone..")
    .then((r) => {
      let i = 0;
      members.forEach((m) => {
        m.roles.add(role);
        i++;
        if (i == members.size) return r.edit("Finished adding role!");
      });
    })
    .catch((err) => {
      message.channel.send("We encountered an error: " + err.message);
    });
};
