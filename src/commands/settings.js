module.exports = {
  aliases: ["settings", "s"],
  plugins: ["settings"],
  use: process.conf.prefix + "settings",
  desc: "View guild specific settings",
  disabled: !(process.conf.settings && process.conf.settings.enabled),
};

module.exports.run = async (client, message, args, { plugins }) => {
  const { settings } = plugins;
  const set = settings.get(message.guild);
  const keys = Object.entries(process.conf.settings)
    .filter((x) => x[1] == true && x[0] != "enabled")
    .map((x) => x[0]);
  const embed = new Discord.MessageEmbed();
  embed.setColor(process.conf.color);
  embed.setTitle("Settings for " + message.guild.name);
  embed.setDescription(
    "Here you can view your settings that have been enabled and see whether they have been set or not. Only settings enabled will be shown here."
  );
  keys.forEach((key) => {
    embed.addField(key, set[key] ? set[key].name : "Not set!", true);
  });
  return message.channel.send(embed);
};
