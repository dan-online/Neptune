const express = require("express");
const { resolve } = require("path");

class Website {
  constructor(config) {
    this.routes = config.routes || [];
    config.port = config.port || "8080";
    this.client = require(resolve(__dirname, "../bot.js"));
    if (process.env.SHARDS && parseInt(process.env.SHARDS) != 0) return;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    if (config.status) {
      this.app.use(
        require("express-status-monitor")({
          chartVisibility: {
            cpu: true,
            mem: true,
            load: true,
            eventLoop: true,
            heap: true,
            responseTime: false,
            rps: false,
            statusCodes: false,
          },
          healthChecks: [
            {
              protocol: "http",
              host: "localhost",
              path: "/status/ping",
              port: config.port,
            },
          ],
        })
      );
      this.app.get("/status/ping", (req, res) => {
        return res
          .status(this.client.ws.status == 0 ? 200 : 500)
          .json({ code: this.client.ws.status, ping: this.client.ws.ping });
      });
    }
    this.routes.forEach((route) => {
      this.app.use(route.route, require(resolve(process.cwd(), route.handler)));
    });
    this.app.listen(config.port, () => {
      log("webs")("app is listening on port " + config.port);
    });
    return this;
  }
}

module.exports = Website;
