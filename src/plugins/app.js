const {
  commands
} = require("../bot");
class App {
  constructor(config) {
    this.port = config.port || 8081;
    console.log("inited");
    this.commands = {
      restart: this.restart,
      saveConfig: this.saveConfig,
      handleErrors: this.handleErrors,
      streamConsole: this.streamConsole,
      test: this.test
    };
    return this;
  }
  streamConsole(socket, data) {
    process.stdout._write_old = process.stdout.write;
    process.stdout.write = (d) => {
      process.stdout._write_old(d);
      socket.emit("console", d);
    }
    log._info = log.info;
    log.info = (d) => {
      socket.emit("console-debug", process.conf.name + ":info " + d);
      log._info(d);
    }
    log._warn = log.warn;
    log.warn = (d) => {
      socket.emit("console-warn", process.conf.name + ":warn " + d);
      log._warn(d);
    }
    log._force = log;
    log = (name, force) => {
      log._force(name, force);
      if (force) return;
      socket.emit("console-force", process.conf.name + ":" + name + " " + d)
    }
  }
  newConnection(socket) {
    socket.emit("config", require("../../config"));
    Object.keys(this.commands).forEach(command => {
      socket.on(command, data => {
        this.commands[command](socket, data);
      });
    });
  }
  test(socket, data) {
    console.log(data);
  }
  restart(socket, data) {
    setTimeout(function () {
      process.once("exit", function () {
        const child = require("child_process").spawn(
          process.argv.shift(),
          process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: "ignore",
            env: process.env,
          }
        );
      });
      process.exit();
    }, 1000);
  }
  saveConfig(socket, config) {
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
  handleErrors(socket, err) {}
  initEarly(plugins) {
    this.app = plugins.website.app ? plugins.website.app : require("express")();
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server, {
      origins: "*:*",
    });
    this.io.use(require("socket.io-encrypt")(String(process.env.SOCKET_KEY)));

    this.io.on("connection", socket => this.newConnection(socket));
    if (!plugins.website.app) {
      this.server.listen(this.port);
    }
    this.server.listen(this.port);
  }
}

module.exports = App;