const plugins = require("../plugins/index");

Object.entries(plugins).forEach((x) => {
  if (x[1].initEarly) {
    plugins[x[0]].initEarly(plugins);
  }
});

module.exports = {
  module: plugins,
  name: "Plugins",
};
