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
            if (route.method == "GET") {
                this.app.get(route.route, (req, res) => {
                    require(resolve(join(__dirname, route.handler)))(req, res, this.client);
                })
                return;
            }
            if (route.method == "POST") {
                this.app.post(route.route, (req, res) => {
                    require(resolve(join(__dirname, route.handler)))(req, res, this.client);
                })
                return;
            }
            if (route.method == "PUT") {
                this.app.put(route.route, (req, res) => {
                    require(resolve(join(__dirname, route.handler)))(req, res, this.client);
                })
                return;
            }
            if (route.method == "DELETE") {
                this.app.delete(route.route, (req, res) => {
                    require(resolve(join(__dirname, route.handler)))(req, res, this.client);
                })
                return;
            }
        });
        this.app.listen(config.port, () => {
            console.log("App is listening on port" + config.port);
        })
    }
}

module.exports = Webhooks;