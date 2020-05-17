process.env.DEBUG = "*";
const client = require("../../index");
console.log = log("test");
client.on("ready", function () {
  console.log("ready event fired");
  setTimeout(() => {
    console.log("client successfully connected, shutting down...");
    process.exit();
  }, 1000);
});
