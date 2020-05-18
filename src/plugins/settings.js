const db = require("../bot").database;
module.exports = class settings {
  constructor(config) {
    this.config = config || {};
    return this;
  }
  set(key, value, name, guild) {
    this.getGuild(guild);
    this.doc[key] = { name, value };
    this.save();
    return this.doc[key];
  }
  get(guild) {
    this.getGuild(guild);
    return this.doc;
  }
  getGuild(guild) {
    if (!guild) return this.guild;
    this.guild = guild;
    this.doc = db.get(guild.id) || {};
    return this.guild;
  }
  save() {
    db.set(this.guild.id, this.doc);
  }
};
