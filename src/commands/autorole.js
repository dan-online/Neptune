module.exports = {
  disabled: !(process.conf.settings && process.conf.settings.autoRole),
  plugins: ["settings"],
  permissions: ["ADMINISTRATOR"],
  aliases: ["autorole", "ar"],
  use: process.conf.prefix + "autorole <@role>",
  desc: "Setup an autorole",
};

module.exports.run = async (client, message, args, { plugins }) => {
  const { settings } = plugins;
  const role = message.mentions.roles.first();
  if (!role) {
    throw new Error("No role mentioned");
  }
  settings.set("autoRole", role.id, role.name, message.guild);
  message.channel.send(
    process.conf.emojis.success.full + " Autorole set to **" + role.name + "**"
  );
};
