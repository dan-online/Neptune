module.exports = {
  aliases: ["shards"],
  use: process.conf.prefix + "shards [-m]",
  desc: "View shards and information",
  disabled: !process.env.SHARDS,
};
module.exports.run = async (client, message, args, mods) => {
  let mobile = args.find((x) => x == "-m");
  var AsciiTable = require("ascii-table");
  var table = new AsciiTable(client.user.username + "'s Shards");
  !mobile
    ? table
        .setHeading("ID", "Status", "Users", "Guilds", "Ping", "RAM", "Uptime")
        .setAlignLeft(0)
    : table.setHeading("ID", "Guilds", "Ping").setAlignLeft(0);

  client.shard
    .broadcastEval(
      "(function(client) {let u = 0; client.guilds.cache.forEach(g => u += g.memberCount); return JSON.stringify({id: process.env.SHARDS, online: parseInt(client.ws.status), users: u, guilds: client.guilds.cache.size, ping: parseInt(client.ws.ping), uptime: parseInt(process.uptime()) + 's', ram: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100})})(this)"
    )
    .then((bevaled) => {
      let total = { users: 0, guilds: 0, ping: [], online: 0, ram: [] };
      bevaled.forEach((obj) => {
        obj = JSON.parse(obj);
        obj.id = obj.id == process.env.SHARDS ? obj.id + " (current)" : obj.id;
        if (obj.online != 0) {
          obj.ping = "N/A";
          obj.guilds = "N/A";
          obj.users = "N/A";
        } else {
          total.online += 1;
          total.ping.push(obj.ping);
          total.ram.push(obj.ram);
          obj.ping = obj.ping + "ms";
          total.users += obj.users;
          total.guilds += obj.guilds;
        }
        let msg;
        switch (obj.online) {
          case 0:
            msg = "online";
            break;
          case 1:
            msg = "connecting...";
            break;
          case 2:
            msg = "reconnecting...";
            break;
          case 3:
            msg = "idle";
            break;
          case 4:
            msg = "logging in";
            break;
          case 5:
            msg = "offline";
            break;
          default:
            msg = "unknown";
            break;
        }
        table = !mobile
          ? table.addRow(
              obj.id,
              msg,
              obj.users,
              obj.guilds,
              obj.ping,
              obj.ram + "MB",
              obj.uptime
            )
          : table.addRow(obj.id, obj.guilds, obj.ping);
      });
      let ping = 0;
      total.ping.forEach((p) => (ping += p));
      ping = ping / total.ping.length;
      let ram = 0;
      total.ram.forEach((r) => (ram += r));
      ram = Math.round((ram / total.ram.length) * 100) / 100;
      table.addRow();
      !mobile
        ? table.addRow(
            "Total",
            total.online + "/" + bevaled.length,
            total.users,
            total.guilds,
            parseInt(ping) + "ms",
            ram + "MB",
            ""
          )
        : table.addRow("Total", total.guilds, parseInt(ping) + "ms");
      message.channel.send("```swift\n" + table.toString() + "```");
    });
};
