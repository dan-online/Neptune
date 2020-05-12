const util = require("util");
module.exports.run = async (client, message, args, extras) => {
  const toEval = args.join(" ");
  try {
    let evaled = eval(toEval);
    evaled = util.inspect(evaled);
    message.channel.send("```js\n" + evaled + "```");
    message.react(process.conf.emojis.success.id);
  } catch (err) {
    err = util.inspect(err);
    message.channel.send("```js\nError: " + err + "```");
    message.react(process.conf.emojis.err.id);
  }
};
module.exports.permissions = ["owner"];
module.exports.aliases = ["eval", "ev"];
module.exports.use = process.conf.prefix + "eval [code]";
module.exports.desc = "Evaluate javascript code";
