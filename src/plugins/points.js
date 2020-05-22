module.exports = class Points extends Enmap {
  constructor(config) {
    super(process.conf.persistent ? { name: "points" } : null);
    this.config = config || {};
    return this;
  }
};
