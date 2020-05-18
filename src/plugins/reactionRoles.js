const db = require("../bot").reactions;
module.exports = class ReactionRoles {
  constructor(config) {
    this.lastUpdated = [];
    this.interval = setInterval(() => {
      this.lastUpdated = this.lastUpdated.filter(
        (x) => new Date() - x.date < 10000
      );
    });
    this.config = config || {};
    return this;
  }
  add(client, user, doc, cb) {
    client.channels.fetch(doc.channel).then((channel) => {
      doc.user = user;
      this.doc = doc;
      const embed = this.embed();
      channel.send(embed).then((e) => {
        doc.roles.forEach((x) => {
          e.react(x.emoji);
        });
        e.id = String(e.id);
        doc.embed = e.id;
        this.doc = doc;
        db.set(e.id, doc);
      });
    });
    return this.doc;
  }
  get(id) {
    this.doc = db.get(id);
    return this.doc;
  }
  addUser(user, embed, reaction, guild) {
    const roleObj = this.doc.roles.find((x) => x.emoji == reaction.emoji.name);
    guild.roles
      .fetch(roleObj.role.id)
      .then((role) => {
        if (!role) return;
        if (role.members.find((m) => m.id == user.id)) return;
        guild.members
          .fetch(user.id)
          .then((m) => {
            m.roles.add(role);
          })
          .catch(() => {});
      })
      .catch(() => {});
  }
  removeUser(user, embed, reaction, guild) {
    const roleObj = this.doc.roles.find((x) => x.emoji == reaction.emoji.name);
    guild.roles
      .fetch(roleObj.role.id)
      .then((role) => {
        if (!role) return;
        if (!role.members.find((m) => m.id == user.id)) return;
        guild.members
          .fetch(user.id)
          .then((m) => {
            m.roles.remove(role);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
  save() {
    return db.set(this.doc.embed, this.doc);
  }
  embed() {
    return new Discord.MessageEmbed()
      .setTitle(this.doc.title)
      .setDescription(
        this.doc.description +
          "\n\n" +
          this.doc.roles
            .map((x) => x.emoji + " - <@&" + x.role.id + ">")
            .join("\n") +
          "\n\n"
      )
      .setFooter("Created by " + this.doc.user.tag, this.doc.user.avatarURL)
      .setColor(process.conf.color)
      .setTimestamp();
  }
};
