const {
    commands
} = require("../bot");
class App {
    constructor(config) {
        this.port = config.port || 8081;
        console.log("inited");

        this.commands = {
            restart: this.restart,
            enablePlugins: this.enablePlugins,
        };
        return this;
    }
    newConnection(socket) {
        Object.keys(this.commands).forEach(command => {
            socket.on(command, data => {
                this.commands[command](data);
            });
        });
    }
    restart(data) {
        console.log("This is pid " + process.pid);
        setTimeout(function () {
            process.on("exit", function () {
                console.log("inisde child process");
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit",
                });
            });
            process.exit();
        }, 5000);
    }
    enableCommands(commandsPath) {
        commandsPath.forEach(commandPath => {
            try {
                delete require.cache[require.resolve(commandPath)];
                const command = require(commandPath);
            } catch {}
            command.alias.forEach(alias => {
                if (commands.get(alias)) {
                    log.warn("overwriting existing alias: " + alias);
                }
                commands.set(alias, command);
            });
        });
        log.info(commands.size + " commands fully loaded");
        return commands.size;
    }
    enablePlugins(pluginsRequest) {
        console.log(pluginsRequest);
        pluginsRequest.forEach(pluginRequest => {
            //example plugin request
            /* 
                  {
                      name: "economy",
                      enabled: true, 
                      coins: "test"
                  }
                  */

            if (Plugins[pluginRequest.name]) {
                return;
            }
            process.conf[pluginsRequest.name] = pluginRequest;
            const plug = require("./" + pluginRequest.name)
            Plugins[pluginRequest.name] = new plug(
                pluginRequest
            );
            if (Plugins[pluginRequest.name].hasOwnProperty("initEarly")) {
                Plugins[pluginRequest.name].initEarly(Plugins);
            }
            fs.readdir(
                path.resolve(__dirname, "..", "commands", pluginRequest.name),
                (err, files) => {
                    if (err) {
                        this.handleErrors(err);
                    }
                    let filePath = [];
                    files.forEach(file => {
                        filePath.push(
                            path.resolve(
                                __dirname,
                                "..",
                                "commands",
                                pluginRequest.name,
                                file
                            )
                        );
                    });
                    this.enableCommands(filepath);
                }
            );
        });
    }
    handleErrors(err) {}
    initEarly(plugins) {
        this.app = plugins.website.app ? plugins.website.app : require("express")();
        this.server = require("http").createServer(this.app);
        this.io = require("socket.io")(this.server, {
            origins: "*:*",
        });
        this.io.on("connection", socket => this.newConnection(socket));
        if (!plugins.website.app) {
            this.server.listen(this.port);
        }
        this.server.listen(this.port);
    }
}

module.exports = App;