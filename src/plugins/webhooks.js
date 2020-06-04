class Webhooks {
  constructor(config) {
    this.config = config;
    return this;
  }
  initEarly(plugins) {
    if (!plugins.website) {
      throw new Error("Website plugin is not enabled!");
    }
    this.app = plugins.website.app;
    this.client = plugins.website.client;
    this.route();
  }
  route() {
    this.config.paths.forEach((x) => {
      this.addRoute(x);
    });
  }
  addRoute(route) {
    this.app.all("/webhooks/" + route.path, (req, res) => {
      const data = req.method == "post" ? req.body : req.query;
      if (route.secret) {
        let checkSecret = Object.entries(route.secret).find((x) => {
          return !(data[x[0]] == x[1]);
        });
        if (checkSecret) {
          return res.status(403).json({ error: "forbidden" });
        }
      }
      this.handlePath(data, res, route);
    });
  }
  createWebhook(info, cb) {
    const channel = this.client.channels.cache.get(info.channel);
    if (!channel) cb(new Error("No channel found for webhook: " + info.name));
    channel
      .createWebhook(info.name, {
        avatar: info.icon,
      })
      .then((webhook) => cb(null, webhook))
      .catch(cb);
  }
  handlePath(body, res, route) {
    if (route.debug) log("body")(body);
    this.createWebhook(route, function (err, webhook) {
      if (err || !webhook) {
        res.status(500).json({ error: err.message || "Webhook failed" });
        throw err;
      }
      var msg = route.map;
      Object.entries(body).forEach(
        (x) => (msg = msg.split("{{" + x[0] + "}}").join(x[1]))
      );
      webhook.send(msg).then(() => {
        webhook.delete();
        res.status(200).json({ status: "ok" });
      });
    });
  }
}

module.exports = Webhooks;
