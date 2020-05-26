const utilFiles = fs.readdirSync(path.resolve(__dirname));
utilFiles.forEach((x) => {
  const name = x.split(".js")[0];
  if (x == "utils.js") return;
  module.exports[name] = require(path.resolve(__dirname, x));
});
