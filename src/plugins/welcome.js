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
    const Worker = require("worker_threads").Worker;
    const worker = new Worker(
      path.resolve(__dirname, "..", "threads", "canvas.js"),
      {
        workerData: {
          member: JSON.stringify(member),
          avatarUrl,
          conf: process.conf,
          name: this.trim(member.displayName, 15),
        },
      }
    );

    worker.on("message", (buffer) => {
      const attachment = new Discord.MessageAttachment(
        Buffer.from(buffer),
        "welcome-image.png"
      );
      this.channelInits[member.guild.id].send("", attachment);
    });
    worker.on("exit", (code) => {
      if (code !== 0)
        console.error(new Error(`Worker stopped with exit code ${code}`));
    });
  }
}

module.exports = Welcome;
