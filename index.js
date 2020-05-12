const path = require("path");
const fs = require("file-system");

global.path = path;
global.fs = fs;

fs.readdir(path.resolve(__dirname, "src", "modules"), function (err, files) {
  files.forEach((file) => {
    const req = require(path.resolve(__dirname, "src", "modules", file));
    if (!req) return;
    global[req.name] = req.module;
  });
  log.info(`Starting ${process.conf.name}@${process.conf.version}`);
  require("./src/bot");
});