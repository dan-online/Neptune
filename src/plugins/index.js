const utilFiles = fs.readdirSync(path.resolve(__dirname));
utilFiles.forEach((x) => {
  const name = x.split(".js")[0];
  if (x == "index.js") return;

  if (!process.conf[name] || !process.conf[name].enabled) {
    if (!process.conf.full) {
      return;
    } else {
      process.conf[name] = {
        enabled: true,
      };
    }
  }
  module.exports[name] = new (require(path.resolve(__dirname, x)))(
    process.conf[name]
  );
});
