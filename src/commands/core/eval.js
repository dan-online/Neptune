const util = require("util");
module.exports = {
  permissions: ["owner"],
  aliases: ["eval", "ev"],
  use: process.conf.prefix + "eval [code]",
  desc: "Evaluate javascript code",
};

/**
 * This command evaluates javascript code
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @param {Array} args - An array of arguments sent with the command
 * @param {object} extras - Enmaps, databases and more
 * @alias Eval
*/
async function evalCommand (client, message, args, extras) {
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

module.exports.run = evalCommand