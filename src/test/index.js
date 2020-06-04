process.env.DEBUG = "*";
const client = require("../../index");
console.log = log("test");
client.on("ready", function () {
  console.log("client successfully connected");
  client.emit("message", { author: { bot: true } });
  setTimeout(() => {
    console.log("message fired without error, shutting down...");
    process.exit();
  }, 1000);
});
