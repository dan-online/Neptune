const { parentPort, workerData } = require("worker_threads");
var {
  member,
  avatarUrl,
  conf,
  name,
  guild,
  message,
  guildUrl,
  tag,
} = workerData;
member = JSON.parse(member);
guild = JSON.parse(guild);
const { addSuffix } = require("../utils/utils");
const { Canvas } = require("canvas-constructor");
const path = require("path");
try {
  Canvas.registerFont(
    conf.welcome.fontPath
      ? path.resolve(conf.welcome.fontPath)
      : path.resolve("src", "assets", "fonts", "OpenSans-Regular.ttf"),
    "default"
  );
} catch {}
const { loadImage } = require("canvas");
var Jimp = require("jimp");

loadImage(avatarUrl).then(image => {
  Jimp.read(guildUrl).then(imageGuildRaw => {
    const imageGuildPre = imageGuildRaw.cover(400, 180).blur(10);
    console.log(guildUrl, imageGuildRaw);
    imageGuildPre.getBuffer(Jimp.AUTO, (err, imageGuild) => {
      console.log(imageGuild);
      const canvas = new Canvas(400, 180)
        // https://github.com/kyranet/canvasConstructor/blob/master/guides/Profile%20Card/ProfileCard.md im lazy ok
        .setColor("#7289DA")
        .addImage(imageGuild, 0, 0, 400, 180)
        .setColor("#2C2F33")
        .addRect(169, 26, 231, 46)
        .addRect(224, 108, 176, 46)
        .setShadowColor("rgba(22, 22, 22, 1)")
        .setShadowOffsetY(5)
        .setShadowBlur(10)
        .addCircle(84, 90, 62)
        .addCircularImage(image, 84, 88, 64)
        .save()
        .createBeveledClip(20, 138, 128, 32, 5)
        .setColor("#23272A")
        .fill()
        .restore()
        .setTextFont("10pt default")
        .setColor("#FFFFFF")
        .setTextAlign("center")
        .addText(name, 85, 158, 105);
      const buffer = canvas.toBuffer();
      parentPort.postMessage(buffer);
    });
  });
});
