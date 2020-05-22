module.exports = {
  disabled: !(process.conf.settings && process.conf.settings.autoRole),
  permissions: ["ADMINISTRATOR"],
  aliases: ["autorole", "ar"],
  use: process.conf.prefix + "autorole <@role>",
  desc: "Setup an autorole",
};

module.exports.run = async (client, message, args) => {
  const { settings } = Plugins;
  const role = message.mentions.roles.first();
  if (!role) {
    throw new Error("No role mentioned");
  }
  settings.setVal("autoRole", role.id, role.name, message.guild);
  message.channel.send(
    process.conf.emojis.success.full + " Autorole set to **" + role.name + "**"
  );
};
