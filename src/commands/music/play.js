module.exports = {
  aliases: ["p", "play"],
  use: process.conf.prefix + "play <yt-link>",
  desc: "Play music",
  // disabled: !(process.conf.music && process.conf.economy.music),
};

module.exports.run = async (client, message, args) => {
  const musicManager = Plugins.music;
  if (!musicManager) return;
  musicManager
    .join(client, message, err => {
      if (err) {
        throw new Error(err);
      }
      console.log(args);
      try {
        musicManager.addSong(client, message, args[0]);
      } catch {
        musicManager.leave(client, message);
        throw new Error("Unable to play current song");
      }
    })
};