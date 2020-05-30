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
  },
];
module.exports.run = async (client, message, args) => {
  const name = args.join(" ");
  if (!name) throw new Error("Provide a name!");
  const guildCustom = Plugins.economy.initGuild(message.guild);
  (function askQ(ind) {
    const q = questions[ind];
    ask(message, q.question, q.options || null, function (err, msg) {});
  })(0);
};
