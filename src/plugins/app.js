class App {
    constructor(config) {
        config.port = config.port || 8080;
        this.app = require("express")();
        // this.app = (Plugins.website.app ? Plugins.website.app : require("express")());
        this.server = require("http").createServer(this.app);
        this.io = require("socket.io")(this.server, {
            origins: "*:*",
        });
        this.io.on("connection", socket => this.newConnection(socket));
        this.server.listen(config.port);
        console.log(this.server);
        return this;
    }
    newConnection(socket) {
        console.log(socket);
    }
}

module.exports = App;