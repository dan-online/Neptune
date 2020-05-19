module.exports = class Tickets extends Enmap {
  constructor(config) {
    super(process.conf.persistent ? { name: "tickets" } : null);
    this.config = config;
    return this;
  }
};
