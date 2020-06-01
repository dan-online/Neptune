module.exports = {
  aliases: ["s", "skip"],
  use: process.conf.prefix + "skip",
  desc: "Skip current song",
  disabled: !(process.conf.music && process.conf.music.enabled),
};

module.exports.run = async (client, message, args) => {
  const musicManager = Plugins.music;
  if (!musicManager) return;
  try {
    musicManager.skip(client, message);
  } catch {
    throw new Error("Unable to skip current song");
  }
};
