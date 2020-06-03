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
    this.app.get("/webhooks/" + route.path, (req, res) => {
      this.handlePath(req.query, res, route);
    });
    this.app.post("/webhooks/" + route.path, (req, res) => {
      this.handlePath(req.body, res, route);
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
