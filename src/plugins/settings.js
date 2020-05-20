module.exports = class Settings extends Enmap {
  constructor(config) {
    super(process.conf.persistent ? { name: "database" } : null);
    this.config = config || {};
    return this;
  }
  setVal(key, value, name, guild) {
    this.fetchGuild(guild);
    this.doc[key] = { name, value };
    this.save();
    return this.doc[key];
  }
  getGuild(guild) {
    this.fetchGuild(guild);
    return this.doc;
  }
  fetchGuild(guild) {
    if (!guild) return this.guild;
    this.guild = guild;
    this.doc = this.fetch(guild.id) || {};
    return this.guild;
  }
  save() {
    this.set(this.guild.id, this.doc);
  }
};
