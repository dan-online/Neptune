const ytdl = require("ytdl-core");

class MusicManager {
  constructor(config) {
    this.config = config;
    this.joined = {};
    this.connections = {};
    this.queues = {};
    return this;
  }
  join(client, message, cb) {
    if (this.joined[message.guild.id]) {
      return cb(null);
    }

    const voiceMessage = message.member.voice.channel;
    if (!voiceMessage) {
      throw new Error("You must be in a voice channel!");
    }
    const perms = voiceMessage.permissionsFor(client.user);
    if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
      throw new Error("Bot lacks perms to join or speak in a voice channel!");
    }
    voiceMessage
      .join()
      .then((connection) => {
        this.joined[message.guild.id] = true;
        this.connections[message.guild.id] = connection;
        this.queues[message.guild.id] = [];
        cb(null);
      })
      .catch((err) => {
        cb(err);
      });
  }
  leave(client, message) {
    if (!this.joined[message.guild.id]) {
      throw new Error("You must be in a voice channel to leave one!");
    }
    try {
      message.member.voice.channel.leave();
      this.joined[message.guild.id] = false;
      // this.connections[message.guild.id].dispatcher.destroy();
      this.queues[message.guild.id] = [];
      delete this.connections[message.guild.id];
    } catch {
      throw new Error("Unable to leave voice channel");
    }
  }
  addSong(client, message, song) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    if (!song) {
      throw new Error("Song is not selected!");
    }
    if (this.queues[message.guild.id].length == 0) {
      this.queues[message.guild.id].push(song);
      let started = false;
      try {
        let test = () => {
          this.queues[message.guild.id].shift();

          if (this.queues[message.guild.id].length <= 0) {
            this.leave(client, message);
            return;
          }
          console.log(this.queues);
          return this.play(message, this.queues[message.guild.id][0], test);
        };
        this.play(message, song, test);
        return;
      } catch (err) {
        throw new Error(err);
      }
    }
    this.queues[message.guild.id].push(song);
  }
  play(message, url, cb) {
    console.log(url);
    const stream = ytdl(url);
    this.connections[message.guild.id].play(stream).on("finish", cb);
  }
  skip(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].dispatcher.end();
  }
  pause(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].dispatcher.pause();
  }
  resume(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].dispatcher.resume();
  }
  clear(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.queues[message.guild.id] = [];
  }
  queue(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    const reply = new Discord.MessageEmbed()
      .setColor(process.conf.color)
      .setThumbnail(client.user.avatarURL());
    var counter = 0;
    this.queues[message.guild.id].forEach((val, index) => {
      reply.addField(index, val);
    });
    message.channel.send(reply);
  }
}

module.exports = MusicManager;
