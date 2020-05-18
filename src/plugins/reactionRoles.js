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
      doc.count = [];
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
  addUser(user, embed, reaction) {
    if (!this.doc.count.find((x) => x == user.id)) this.doc.count.push(user.id);
    else return;
    embed.edit(this.embed());
    this.save();
  }
  removeUser(user, embed, reaction) {
    if (this.doc.count.find((x) => x == user.id))
      this.doc.count = this.doc.count.filter((x) => x != user.id);
    else return;
    embed.edit(this.embed());
    this.save();
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
          "\n\n" +
          this.doc.count.length +
          " role" +
          (this.doc.count.length == 1 ? "" : "s") +
          " assigned\n\n"
      )
      .setFooter("Created by " + this.doc.user.tag, this.doc.user.avatarURL)
      .setColor(process.conf.color)
      .setTimestamp();
  }
};
