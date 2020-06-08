const Debug = require("debug");
require("./Env");
const Info = Debug(
  process.conf.name +
    (process.env.SHARDS ? ":" + process.env.SHARDS : "") +
    ":info"
);
const Warn = Debug(
  process.conf.name +
    (process.env.SHARDS ? ":" + process.env.SHARDS : "") +
    ":warn"
);
const Logger = (name, force) => {
  if (force) return Info(name);
  return Debug(
    process.conf.name +
      (process.env.SHARDS ? ":" + process.env.SHARDS : "") +
      ":" +
      name
  );
};
Logger.info = Info;
Logger.warn = Warn;
module.exports = {
  module: Logger,
  name: "log",
};
