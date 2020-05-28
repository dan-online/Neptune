const utilFiles = fs.readdirSync(path.resolve(__dirname));
utilFiles.forEach((x) => {
  const name = x.split(".js")[0];
  if (x == "index.js") return;
  if (
    !process.conf[name] ||
    (!process.conf[name].enabled && !process.conf.full)
  )
    return;
  module.exports[name] = new (require(path.resolve(__dirname, x)))(
    process.conf[name]
  );
});
