const Debug = require("debug");
require("./env");
const Info = Debug(process.conf.name + ":info");

const Logger = (name, force) => {
  if (force) return Info(name);
  return Debug(process.conf.name + ":" + name);
};
Logger.info = Info;

module.exports = {
  module: Logger,
  name: "log",
};
