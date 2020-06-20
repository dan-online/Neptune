module.exports = {
  aliases: ["additem", "add-item", "addi", "additems"],
  use: process.conf.prefix + "additem <name>",
  desc: "Add an item to the guilds items store",
  disabled: !(process.conf.economy && process.conf.economy.enabled),
  permissions: ["MANAGE_SERVER"],
};
const { ask } = require("../../utils");

module.exports.run = async (client, message, args) => {
  const questions = [
    {
      question: "📃 What description would you like **{{name}}** to have?",
      val(msg) {
        return msg.content;
      },
      key: "desc",
    },
    {
      question: "What price would you like **{{name}}** to have?",
      val(msg) {
        return msg.content;
      },
      test(msg) {
        if (isNaN(msg.content)) {
          throw new Error("Response is not a number!");
        }
      },
      key: "price",
    },
  ];

  const name = args.join(" ");
  if (!name) throw new Error("Provide a name!");
  const guildCustom = Plugins.economy.initGuild(message.guild);
  const doc = {
    name,
  };
  (function askQ(ind) {
    const q = questions[ind];
    if (!q) return finish();
    ask(
      message,
      q.question.split("{{name}}").join(name),
      q.options || null,
      function (err, msg) {
        if (err) {
          return message.channel.send(
            "Oops we ran into an error: " + err.message
          );
        }
        try {
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
          if (msg.content.toLowerCase == "cancel") {
            return;
          }
          if (err.message) {
            return askQ(ind);
          }
        }
        doc[q.key] = q.val(msg);
        askQ(ind + 1);
      }
    );
  })(0);

  function finish() {
    guildCustom.addItem(doc);
    message.channel.send("Item was added successfully!");
  }
};
