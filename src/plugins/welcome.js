const { Canvas } = require("canvas-constructor");

const { loadImage } = require("canvas");

Canvas.registerFont(
  process.conf.welcome.fontPath
    ? path.resolve(process.conf.welcome.fontPath)
    : path.resolve("src", "assets", "fonts", "OpenSans-Regular.ttf"),
  "default"
);

class Welcome {
  constructor(config) {
    this.channel = config.channel;
    this.welcomeMessage = config.welcomeMessage
      ? config.welcomeMessage
      : "Welcome!";
    this.leaveMessage = config.leaveMessage
      ? config.leaveMessage
      : "See ya soon!";
    this.channelInits = {};
    this.color = config.accent;
    return this;
  }
  welcome(member) {
    if (this.channelInits[member.guild.id]) {
      this._createCanvas(member);
      return;
    }
    this._checkWelcomeChannel(member);
  }
  _createWelcomeChannel(member) {
    return member.guild.channels.create(this.channel);
  }
  _checkWelcomeChannel(member) {
    this.channelInits[member.guild.id] = member.guild.channels.cache.find(
      (channel) => channel.name == this.channel
    );
    if (!this.channelInits[member.guild.id]) {
      this._createWelcomeChannel(member).then(() => {
        this.welcome(member);
      });
    } else {
      this.welcome(member);
    }
  }
  leave(member) {
    if (this.channelInits[member.guild.id]) {
      //actually welcome user
      return;
    }
    this._checkWelcomeChannel(member, this.leave);
  }
  trim(text, size = 100) {
    if (text.length > size) {
      return text.slice(0, size - 3) + "...";
    } else {
      return text;
    }
  }

  _createCanvas(member) {
    const avatarUrl = member.user.avatarURL({
      size: 128,
      format: "png",
    });
    loadImage(avatarUrl).then((image) => {
      const canvas = new Canvas(400, 180)
        // https://github.com/kyranet/canvasConstructor/blob/master/guides/Profile%20Card/ProfileCard.md im lazy ok
        .setColor("#7289DA")
        .addRect(84, 0, 316, 180)
        .setColor("#2C2F33")
        .addRect(0, 0, 84, 180)
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
        .addText(this.trim(member.displayName, 15), 85, 158, 105);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
      );
      this.channelInits[member.guild.id].send("", attachment);
    });
  }
}

module.exports = Welcome;
