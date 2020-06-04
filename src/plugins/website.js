const express = require("express");
const { resolve } = require("path");

class Website {
  constructor(config) {
    this.routes = config.routes;
    this.client = require(resolve(__dirname, "../bot.js")).client;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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
