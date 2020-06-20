module.exports = {
  aliases: ["pl", "play"],
  use: process.conf.prefix + "play <yt-link>",
  desc: "Play music",
  disabled: !(process.conf.music && process.conf.music.enabled),
};
const regex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
module.exports.run = async (client, message, args) => {
  const musicManager = Plugins.music;
  if (!musicManager) return;
  if (!args[0]) throw new Error("You need to provide a Youtube video link");
  if (!regex.test(args[0]))
    throw new Error("This is not a valid Youtube video link");
  musicManager.join(client, message, (err) => {
    if (err) {
      return message.channel.send("Whoops: " + err);
    }
    try {
      musicManager.addSong(client, message, args[0]);
    } catch {
      musicManager.leave(client, message);
      return message.channel.send("Whoops: Unable to play current song");
    }
  });
};
