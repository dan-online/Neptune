module.exports = class ReactionRoles {
  constructor(config) {
    this.config = config || {};
    this.db = new Enmap(process.conf.persistent ? { name: "reactions" } : null);
    return this;
  }
  get(id) {
    return this.db.get(id);
  }
};
