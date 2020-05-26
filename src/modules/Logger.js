const Debug = require("debug");
require("./Env");
const Info = Debug(process.conf.name + ":info");
const Warn = Debug(process.conf.name + ":warn");
const Logger = (name, force) => {
  if (force) return Info(name);
  return Debug(process.conf.name + ":" + name);
};
Logger.info = Info;
Logger.warn = Warn;
module.exports = {
  module: Logger,
  name: "log",
};
