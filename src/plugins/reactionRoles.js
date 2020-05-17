module.exports = class ReactionRoles {
  constructor(config) {
    this.config = config || {};
    this.db = new Enmap(process.conf.persistent ? { name: "reactions" } : null);
    return this;
  }
  get(id) {
    this.doc = this.db.get(id);
    return this.doc;
  }
  addUser(user) {
    console.log(user.member.id);
  }
};
