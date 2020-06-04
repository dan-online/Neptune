const git = require("simple-git")(process.cwd());

class Update {
  constructor(config) {
    this.config = config;
    this.get();
    this.startInterval();
    return this;
  }
  checkCommits() {}
  handle(err, data, cb) {
    if (err) {
      log("erro")(err.message);
    }
    cb(data);
  }
  fetch(cb) {
    git.fetch("origin", "master", (err, data) => this.handle(err, data, cb));
  }
  checkDiff(cb) {
    git.diffSummary(["master", "origin/master"], (err, data) =>
      this.handle(err, data, cb)
    );
  }
  startInterval() {
    this.interval = setInterval(() => this.get(), 60000);
  }
  get() {
    this.fetch(() => {
      this.checkDiff(console.log);
    });
  }
}

module.exports = Update;
