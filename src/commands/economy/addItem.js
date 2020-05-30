module.exports = {
  aliases: ["additem", "add-item", "addi"],
  use: process.conf.prefix + "additem <name>",
  desc: "Add an item to the guilds items store",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
  permissions: ["MANAGE_SERVER"],
};
const { ask } = require("../../utils");
const questions = [
  {
    question: "📃 What description would you like **{{name}}** to have?",
    val(msg) {
      return msg.content;
    },
  },
];
module.exports.run = async (client, message, args) => {
  const name = args.join(" ");
  if (!name) throw new Error("Provide a name!");
  const guildCustom = Plugins.economy.initGuild(message.guild);
  const doc = { name };
  (function askQ(ind) {
    const q = questions[ind];
    if (!q) return finish();
    ask(
      message,
      q.question.split("{{name}}").join(name),
      q.options || null,
      function (err, msg) {
        try {
          if (err) {
            throw err;
          }
          if (!msg.content) {
            throw new Error("No answer provided!");
          }
          if (msg.content.toLowerCase() == "cancel") {
            throw new Error("Setup canceled!");
          }
          if (q.test) {
            q.test(msg);
          }
        } catch (err) {
          message.channel.send(
            process.conf.emojis.err.full +
              "  " +
              (err.message || "Setup timed out!")
          );
          if (err.message) {
            return askQ(ind);
          }
        }
        doc[q.key] = q.val(msg);
        askQ(ind + 1);
      }
    );
  })(0);
  function finish() {}
};
