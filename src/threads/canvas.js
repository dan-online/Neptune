const { parentPort, workerData } = require("worker_threads");
var { member, avatarUrl, conf, name, guild } = workerData;
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

loadImage(avatarUrl).then((image) => {
  const canvas = new Canvas(400, 180)
    // https://github.com/kyranet/canvasConstructor/blob/master/guides/Profile%20Card/ProfileCard.md im lazy ok
    .setColor("#7289DA")
    .addRect(84, 0, 316, 180)
    .setColor("#2C2F33")
    .addRect(0, 0, 84, 180)
    .addRect(169, 26, 231, 120)
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
    .setTextFont("15pt default")
    .setColor("#FFFFFF")
    .addText("WELCOME", 180, 55)
    .setTextFont("10pt default")
    .addText("to " + guild.name, 180, 80)
    .addText("you are the " + addSuffix(guild.memberCount) + " user", 180, 105)
    .setTextAlign("center")
    .addText(name, 85, 158, 105);
  const buffer = canvas.toBuffer();
  parentPort.postMessage(buffer);
});
