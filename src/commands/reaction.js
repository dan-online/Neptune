const { ask } = require("../utils/utils");

module.exports = {
  plugins: ["reactionRoles"],
  permissions: ["ADMINISTRATOR"],
  aliases: ["reaction", "reactionroles", "rr"],
  use: process.conf.prefix + "reaction",
  desc: "Setup a reaction roles message",
};

module.exports.run = async (client, message, args, { plugins }) => {
  const doc = { id: uuid.v4(), roles: [], user: message.author.id };
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
  function roles() {
    message.channel.send(
      "Great let's setup the roles! ``cancel`` will still cancel this setup"
    );
    askRole();
    function askRole() {
      ask(
        message,
        "🏓 Mention a role to continue or say ``done`` to finish!",
        function (err, role) {
          if (err)
            return message.channel.send(
              "We encountered an error: " + err.message
            );
          if (role.content == "cancel") {
            return message.channel.send("Setup canceled!");
          }
          if (role.content == "done") {
            return finish();
          }
          const roleToAdd = role.mentions.roles.first();
          if (!roleToAdd) {
            message.channel.send("Invalid role mention, try again");
            return askRole();
          }
          ask(message, "🙊 What emoji would you like for this role?", function (
            err,
            emoji
          ) {
            if (err)
              return message.channel.send(
                "We encountered an error: " + err.message
              );
            if (role.content == "cancel") {
              return message.channel.send("Setup canceled!");
            }
            emoji
              .react(emoji.content)
              .catch((err) => {
                message.channel.send("This emoji is invalid, try again");
                return askRole();
              })
              .then(() => {
                doc.roles.push({ emoji: emoji.content, role: roleToAdd });
                message.channel.send("React role successfully added");
                return askRole();
              });
          });
        }
      );
    }
  }
  function finish() {
    if (doc.roles.length == 0)
      return message.channel.send("No roles were assigned! Try again");
    message.channel
      .send("Reaction roles setup has completed, please wait..")
      .then((m) => {
        const { reactionRoles } = plugins;
        reactionRoles.add(client, message.author, doc, function () {
          return m.edit();
        });
      });
  }
};
