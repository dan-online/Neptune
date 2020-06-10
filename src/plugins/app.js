const {
  commands
} = require("../bot");

const spawn = require("cross-spawn");
const ss = require("socket.io-stream");
class App {
  constructor(config) {
    this.port = config.port || 8081;
    console.log("inited");
    this.commands = {
      restart: this.restart,
      saveConfig: this.saveConfig,
      handleErrors: this.handleErrors,
    };
    this.socketStreamCommands = {
      streamConsole: this.streamConsole,
    };
    return this;
  }
  streamConsole(stream, data) {
    process.stdout.pipe(stream);
  }
  newConnection(socket) {
    socket.emit("config", require("../../config"));
    Object.keys(this.commands).forEach(command => {
      socket.on(command, data => {
        this.commands[command](data);
      });
    });
    Object.keys(this.socketStreamCommands).forEach(command => {
      ss(socket).on(command, this.socketStreamCommands[command]);
    });
  }
  restart(data) {
    setTimeout(function () {
      process.once("exit", function () {
        const child = require("child_process").spawn(
          process.argv.shift(),
          process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: "ignore",
          }
        );
      });
      process.exit();
    }, 1000);
  }
  saveConfig(config) {
    console.log("we were in config");
    const app = this;
    fs.writeFile(
      path.resolve(__dirname, "..", "..", "config-back.js"),
      "module.exports = " + JSON.stringify(require("../../config")),
      err => {
        app.handleErrors(err);
        fs.writeFile(
          path.resolve(__dirname, "..", "..", "config.js"),
          "module.exports = " + JSON.stringify(config),
          function (err) {
            app.handleErrors(err);
            app.restart();
          }
        );
      }
    );
  }
  handleErrors(err) {}
  initEarly(plugins) {
    this.app = plugins.website.app ? plugins.website.app : require("express")();
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server, {
      origins: "*:*",
    });
    this.io.use(require("socket.io-encrypt")(process.env.SOCKET_KEY));

    this.io.on("connection", socket => this.newConnection(socket));
    if (!plugins.website.app) {
      this.server.listen(this.port);
    }
    this.server.listen(this.port);
  }
}

module.exports = App;