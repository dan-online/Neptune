const path = require("path");
const fs = require("file-system");

global.path = path;
global.fs = fs;

const files = fs.readdirSync(path.resolve(__dirname, "src", "modules"));

files.forEach((file) => {
  const req = require(path.resolve(__dirname, "src", "modules", file));
  if (!req) return;
  global[req.name] = req.module;
});

log.info(
  `Starting ${process.conf.name}@${process.conf.version} ${
    process.argv.find((x) => x == "--shard=") || ""
  }`
);
var Neptune = require("./src/bot");

module.exports = Neptune;
