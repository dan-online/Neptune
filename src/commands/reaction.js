const { ask } = require("../utils/utils");
module.exports.run = async (client, message) => {
  const doc = { id: uuid.v4() };
  const questions = [
    {
      q: "✍️ What title would you like?",
      answers: null,
      key: "title",
      process: null,
    },
    {
      q: "📣 What description would you like?",
      answers: null,
      key: "description",
      process: null,
    },
    {
      q: "📱 What channel should this be posted in?",
      answers: null,
      key: "channel",
      process: (m) => m.mentions.channels.first().id,
    },
  ];
  ask(
    message,
    "😝 Would you like to start setup of reaction roles?",
    ["yes", "no"],
    function (err, start) {
      if (err || start.content == "no")
        return message.channel.send("Setup canceled!");

      message.channel.send("To cancel just say ``cancel`` at any time!");
      (function nextQ(index) {
        let quest = questions[index];
        if (!quest) return roles();
        ask(message, quest.q, quest.answers, (err, answer) => {
          if (err)
            return message.channel.send(
              "We encountered an error: " + err.message
            );
          if (answer.content == "cancel")
            return message.channel.send("Setup canceled!");
          try {
            doc[quest.key] = quest.process
              ? quest.process(answer)
              : answer.content;
            if (!doc[quest.key]) {
              throw new Error("Invalid answer");
            }
          } catch (err) {
            return message.channel.send("We couldn't understand your answer!");
          }
          index++;
          nextQ(index);
        });
      })(0);
    }
  );
  function roles() {}
};
module.exports.permissions = ["ADMINISTRATOR"];
module.exports.aliases = ["reaction", "reactionroles", "rr"];
module.exports.use = process.conf.prefix + "reaction";
module.exports.desc = "Setup a reaction roles message";
