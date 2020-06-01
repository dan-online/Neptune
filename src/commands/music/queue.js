module.exports = {
  aliases: ["q", "queue"],
  use: process.conf.prefix + "queue",
  desc: "Get current music queue",
  disabled: !(process.conf.music && process.conf.music.enabled),
};

module.exports.run = async (client, message, args) => {
  const musicManager = Plugins.music;
  if (!musicManager) return;
  try {
    musicManager.queue(client, message);
  } catch (err) {
    throw new Error(err);
  }
};
