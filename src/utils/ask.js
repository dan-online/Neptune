module.exports = function (message, question, choices, cb) {
  if (!cb && choices) {
    cb = choices;
    choices = null;
  }
  function checkChoices(m) {
    if (!choices) return true;
    let content = m.content.toLowerCase();
    if (choices.find((x) => x == content)) {
      return true;
    } else {
      return false;
    }
  }
  message.channel
    .send(question + (choices ? " [" + choices.join(",") + "]" : ""))
    .then((q) => {
      message.channel
        .awaitMessages(
          (m) => message.author.id == m.author.id && checkChoices(m),
          {
            max: 1,
            time: 60000,
            errors: ["time"],
          }
        )
        .then((collected) => {
          let collect = collected.first();
          q.edit(question + " **" + collect.content + "**");
          cb(null, collect);
        })
        .catch((err) => {
          console.error(err);
          q.edit("This question timed out: " + err.message);
          cb(err);
        });
    });
};
