const Discord = require("discord.js");
const log = require("./src/modules/Logger").module;
const path = require("path");

var Neptune = new Discord.ShardingManager(path.resolve(__dirname, "index.js"));
Neptune.on("shardCreate", function (shard) {
  log("shrd")("shard " + shard.id + " is online");
});
Neptune.spawn(2);
