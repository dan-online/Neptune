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
  return message.channel
    .send(
      typeof question == "string" ?
      question + (choices ? " [" + choices.join(",") + "]" : "") :
      question
    )
    .then((q) => {
      message.channel
        .awaitMessages(
          (m) => message.author.id == m.author.id && checkChoices(m), {
            max: 1,
            time: 60000,
            errors: ["time"],
          }
        )
        .then((collected) => {
          let collect = collected.first();
          if (typeof question == "string")
            q.edit(question + " **" + collect.content + "**");
          cb(null, collect, q);
        })
        .catch((err) => {
          if (typeof question == "string")
            q.edit("This question timed out: " + (err.message || ""));
          else
            q.delete().then(() =>
              message.channel.send("This question timed out")
            );
          cb(err);
        });
    });
};