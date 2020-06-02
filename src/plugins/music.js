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
      message.channel.send("Leaving voice channel...");
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
      try {
        let test = () => {
          this.queues[message.guild.id].shift();

          if (this.queues[message.guild.id].length <= 0) {
            this.leave(client, message);
            return;
          }
          return this.play(message, this.queues[message.guild.id][0], test);
        };
        this.play(message, song, test);
        return;
      } catch (err) {
        throw new Error(err);
      }
    }
    this.queues[message.guild.id].push(song);
    message.channel.send(
      message.author.tag + " pushed a new song to the queue!"
    );
  }
  play(message, url, cb) {
    ytdl.getInfo(url).then((info) => {
      const stream = ytdl(url, { format: "audioonly" });
      this.connections[message.guild.id].play(stream).on("finish", cb);
      const embed = new Discord.MessageEmbed()
        .setTitle("Playing...")
        .setColor(process.conf.color)
        .addField("Title", info.videoDetails.title, true)
        .addField(
          "Description",
          info.videoDetails.shortDescription.slice(0, 100) + "...",
          true
        )
        .setFooter(
          info.videoDetails.ownerChannelName,
          info.videoDetails.ownerProfileUrl
        )
        .setThumbnail(
          info.videoDetails.thumbnail.thumbnails[
            info.videoDetails.thumbnail.thumbnails.length - 1
          ].url
        );
      return message.channel.send(embed);
    });
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
    message.channel.send("Stream paused by " + message.author.tag);
  }
  resume(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].dispatcher.resume();
    message.channel.send("Stream resumed by " + message.author.tag);
  }
  clear(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.queues[message.guild.id] = [];
    message.channel.send("Stream queue cleared by " + message.author.tag);
  }
  queue(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    const split = [];
    this.queues[message.guild.id].forEach((x) => {
      if (!split[0] || split[split.length - 1].length > 4) {
        split.push([x]);
      } else {
        split[split.length - 1].push(x);
      }
    });
    split.forEach((s) => {
      const reply = new Discord.MessageEmbed().setColor(process.conf.color);
      console.log(s);
      s.forEach((val, index) => {
        ytdl.getBasicInfo(val).then((info) => {
          reply.addField(info.videoDetails.title, val);
          if (index == s.length - 1) {
            message.channel.send(reply);
          }
        });
      });
    });
  }
}

module.exports = MusicManager;
