const {
  parentPort,
  workerData
} = require("worker_threads");
var {
  member,
  avatarUrl,
  conf,
  name,
  guild,
  message,
  guildUrl
} = workerData;
member = JSON.parse(member);
guild = JSON.parse(guild);
const {
  addSuffix
} = require("../utils/utils");
const {
  Canvas
} = require("canvas-constructor");
const path = require("path");
try {
  Canvas.registerFont(
    conf.welcome.fontPath ?
    path.resolve(__dirname, conf.welcome.fontPath) :
    path.resolve("src", "assets", "fonts", "Poppins-Regular.ttf"),
    "default"
  );
} catch {}
const {
  loadImage
} = require("canvas");
var Jimp = require("jimp");

loadImage(avatarUrl).then((image) => {
  Jimp.read(guildUrl).then((imageGuildRaw) => {
    const imageGuildPre = imageGuildRaw.cover(400, 180).blur(10);
    imageGuildPre.getBuffer(Jimp.AUTO, (err, imageGuild) => {
      const canvas = new Canvas(400, 180)
        // https://github.com/kyranet/canvasConstructor/blob/master/guides/Profile%20Card/ProfileCard.md im lazy ok
        .setColor("#7289DA")
        .addImage(imageGuild, 0, 0, 400, 180)
        .setColor("#2C2F33")
        .addRect(169, 26, 231, 46)
        .addRect(215, 108, 185, 46)
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
        .addText(name, 85, 158, 105)
        .setTextAlign("center")
        .setTextFont("11.5pt default")
        .addText(message, 240, 53.5, 176)
        .setTextAlign("left")
        .setTextFont("9pt default")
        .addText(
          "You are the " + addSuffix(guild.members.length) + " member!",
          230,
          135,
          176
        );
      const buffer = canvas.toBuffer();
      parentPort.postMessage(buffer);
    });
  });
});