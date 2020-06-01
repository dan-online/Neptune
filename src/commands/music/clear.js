module.exports = {
  aliases: ["clear"],
  use: process.conf.prefix + "clear",
  desc: "Clear music queue",
  disabled: !(process.conf.music && process.conf.music.enabled),
};

module.exports.run = async (client, message, args) => {
  const musicManager = Plugins.music;
  if (!musicManager) return;
  try {
    musicManager.clear(client, message);
  } catch (err) {
    throw new Error(err);
  }
};
