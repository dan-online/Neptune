const ytdl = require("ytdl-core");
const {
  catchExit
} = require("../utils");
class MusicManager {
  constructor(config) {
    this.config = config;
    this.joined = {};
    this.connections = {};
    this.queues = {};
    catchExit((next) => {
      log.info("closing voice connections");
      const connections = Object.entries(this.connections);
      if (connections.length == 0) return next();
      connections.forEach((x, i) => {
        try {
          x[1].channel
            .send(
              "Shutting down...the stream currently playing will end in a moment, sorry for any inconvenience"
            )
            .then(() => {
              if (i == connections.length - 1) {
                return next();
              }
            });
          x[1].connection.dispatcher.destroy();
          x[1].voice.leave();
          delete this.connections[x[0]];
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      });
    });
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
        this.connections[message.guild.id] = {
          connection,
          channel: message.channel,
          voice: voiceMessage,
        };
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
  test(message, client) {

    this.queues[message.guild.id].shift();
    if (this.queues[message.guild.id].length <= 0) {
      this.leave(client, message);
      return;
    }
    return this.play(message, this.queues[message.guild.id][0], this.test);

  }
  addSong(client, message, song) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    if (!song) {
      throw new Error("Song is not selected!");
    }
    ytdl
      .getBasicInfo(song)
      .then((info) => {
        if (!info || !info.videoDetails || !info.videoDetails.title)
          throw new Error("No video found!");
        if (this.queues[message.guild.id].length == 0) {
          this.queues[message.guild.id].push({
            url: song,
            info
          });
          try {
            this.play(message, this.queues[message.guild.id][0], () => {
              this.test(message, client)
            })
          } catch (err) {
            throw new Error(err);
          }

          return;
        }
        this.queues[message.guild.id].push({
          url: song,
          info
        });
        message.channel.send(
          message.author.tag + " pushed a new song to the queue!"
        );
      })
      .catch((err) => {
        throw err;
      });
  }
  play(message, q, cb) {
    const {
      url,
      info
    } = q;
    const stream = ytdl(url, {
      format: "audioonly"
    });
    this.connections[message.guild.id].connection.play(stream).on("finish", cb);
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
        info.videoDetails.author.avatar
      )
      .setThumbnail(
        info.videoDetails.thumbnail.thumbnails[
          info.videoDetails.thumbnail.thumbnails.length - 1
        ].url
      );
    return message.channel.send(embed);
  }
  skip(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.test(message, client)
  }
  pause(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].connection.dispatcher.pause();
    message.channel.send("Stream paused by " + message.author.tag);
  }
  resume(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.connections[message.guild.id].connection.dispatcher.resume();
    message.channel.send("Stream resumed by " + message.author.tag);
  }
  clear(client, message) {
    if (!this.joined[message.guild.id]) {
      return;
    }
    this.queues[message.guild.id] = [this.queues[message.guild.id][0]];

    message.channel.send("Stream queue cleared by " + message.author.tag);
  }
  stop(client, message) {
    if (!this.joined[message.guild.id]) {
      throw new Error("I'm not connected to a voice channel!");
    }
    this.connections[message.guild.id].connection.dispatcher.destroy();
    this.queues[message.guild.id] = [];
    this.leave(client, message);
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
      const reply = new Discord.MessageEmbed()
        .setColor(process.conf.color)
        .setTitle("Queue")
        .setDescription(
          s.map((x, i) => `${i + 1}. [${x.info.videoDetails.title}](${x.url})`)
        );
      message.channel.send(reply);
    });
  }
}

module.exports = MusicManager;