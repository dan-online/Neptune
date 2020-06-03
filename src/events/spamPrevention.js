const spam = new Enmap();
const linkRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
let had = [];
module.exports = {
  name: "message",
  event(client, message) {
    if (had.find((x) => x.id == message.id)) {
      return;
    }
    had.push(message);
    had = had.filter((x) => new Date() - x.createdAt < 10000);
    if (
      message.author.id == client.user.id ||
      message.author.bot ||
      !message.guild
    )
      return;
    if (linkRegex.test(message.content)) {
      message
        .reply("Please do not send invite links in this guild")
        .then((m) => {
          setTimeout(() => {
            m.delete().catch(() => {});
          }, 3000);
        });
      return message.delete();
    }
    let userSpam = spam.get(message.author.id) || { messages: [], spam: [] };
    userSpam.messages.push(message);
    if (
      userSpam.messages.filter((x) => new Date() - x.createdAt < 1000).length >
      3
    ) {
      userSpam.spam.push(message);
      userSpam.messages = [];
      message.reply(
        "[Warning] [spam] You have " +
          userSpam.spam.length +
          "/3 warnings before kick"
      );
    }
    if (userSpam.spam.length >= 3) {
      message.member
        .kick()
        .catch((err) => {
          message.channel.send(
            "I encountered an error when kicking " +
              message.author.tag +
              ": " +
              err.message
          );
        })
        .then((m) => {
          userSpam.spam = [];
          message.channel.send(
            message.author.tag + " has been kicked for excessive spam!"
          );
          spam.set(message.author.id, userSpam);
        });
    }
    userSpam.messages = userSpam.messages.filter(
      (m) => new Date() - m.createdAt < 30000
    );
    userSpam.spam = userSpam.spam.filter(
      (x) => new Date() - x.createdAt < 3600000
    );
    spam.set(message.author.id, userSpam);
  },
};
