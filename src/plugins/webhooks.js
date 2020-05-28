const express = require("express");
const {
    resolve,
    join
} = require("path")

class Webhooks {
    constructor(config) {
        this.routes = config.routes;
        this.client = require(resolve(join(__dirname, "../bot.js"))).client;
        this.app = express();
        console.log(this.app)
        this.routes.forEach((route) => {
            this.app[route.method](route.route, (req, res) => {
                require(resolve(join(__dirname, route.handler)))(req, res, this.client);
            })
        });
        this.app.listen(config.port, () => {
            console.log("App is listening on port" + config.port);
        })
    }
}

module.exports = Webhooks;