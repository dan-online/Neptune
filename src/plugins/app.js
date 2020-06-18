<< << << < HEAD
  ===
  === =
  const {
    commands
  } = require("../bot"); >>>
>>> > e998a41e7d368ccd61f64c04a6570647081a671d
/** A plugin that enables the front-end application */
const client = require("../bot");

class App {
  /**
   *Creates an instance of App.
   * @param {Object} config The config as provided by the enviorment
   * @memberof App
   */
  constructor(config) {
    this.port = config.port || 8081;
    /** @private */
    this.commands = {
      restart: this.restart,
      saveConfig: this.saveConfig,
      handleErrors: this.handleErrors,
      streamConsole: this.streamConsole,
      test: this.test,
      error: this.handleErrors,
      shutdown: this.shutdown,
    };
    this.ready = false;
    client.on("ready", () => {
      console.log("client readied");
      this.ready = true;
    });
    return this;
  }

  /**
   * Streams all console input into socket with various event names. This is done by attaching event listeners and emitting events with the data.
   * @param {Socket} socket The incoming socket conneciton
   * @memberof App
   */
  streamConsole(socket) {
    process.stdout._write_old = process.stdout.write;
    process.stdout.write = (d) => {
      process.stdout._write_old(d);
      socket.emit("console", d);
    };
    log._info = log.info;
    log.info = (d) => {
      socket.emit("console-debug", process.conf.name + ":info " + d);
      log._info(d);
    };
    log._warn = log.warn;
    log.warn = (d) => {
      socket.emit("console-warn", process.conf.name + ":warn " + d);
      log._warn(d);
    };
    log._force = log;
    log = (name, force) => {
      log._force(name, force);
      if (force) return;
      socket.emit("console-force", process.conf.name + ":" + name + " " + d);
    };
  }

  /**
   * @private
   * @param {Socket} socket The incoming socket connection
   * @memberof App
   */
  newConnection(socket) {
    console.log(this.ready);
    if (!this.ready) {
      socket.disconnect();
      return;
    }
    socket.emit("config", require("../../config"));
    var config = require("../../config");
    config["avatar_url"] = client["user"].avatarURL({
      size: 512,
      format: "png",
    });
    socket.emit("config", config);
    Object.keys(this.commands).forEach(command => {
      socket.on(command, data => {
        this.commands[command](socket, data);
      });
    });
  }
  /**
   * This is a method used to restarrt the application
   * @memberof App
   */
  restart() {
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
  /**
   * This method is used to save the incoming config into config.js, and backing up the old config into config-back.js
   * @param {Socket} socket The incoming socket connection
   * @param {Object} config The incoming config from the socket
   * @memberof App
   */
  saveConfig(socket, config) {
    const app = this;
    fs.writeFile(
      path.resolve(__dirname, "..", "..", "config-back.js"),
      "module.exports = " + JSON.stringify(require("../../config")),
      (err) => {
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

  /**
   * This method handles errors (by logging client side and server side)
   * @param {Socket} socket The incoming socket connection
   * @param {Error} err The generated error
   * @memberof App
   */
  handleErrors(socket, err) {
    console.log(err);
  }

  /**
   * This is a method called to properly initalize the plugin
   * @private
   * @param {*} plugins
   * @memberof App
   */
  initEarly(plugins) {
    this.app = plugins.website.app ? plugins.website.app : require("express")();
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server, {
      origins: "*:*",
    });
    this.io.use(require("socket.io-encrypt")("123"));
    console.log(process.env.SOCKET_KEY);
    this.io.on("connection", (socket) => this.newConnection(socket));
    if (!plugins.website.app) {
      this.server.listen(this.port);
    }
    this.server.listen(this.port);
    log.info("App is listening on port ", this.port);
  }
  error(socket, err) {
    console.log(err);
  }
  shutdown() {
    console.log("Shutting down!");
    process.exit(1);
  }
}

module.exports = App;