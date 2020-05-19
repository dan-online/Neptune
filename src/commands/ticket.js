module.exports = {
  plugins: ["tickets"],
  aliases: ["ticket", "t"],
  use: process.conf.prefix + "ticket <reason>",
  desc: "Open a ticket for support",
};

module.exports.run = async (client, message, args, { plugins }) => {
  const { tickets } = plugins;
  if (tickets.find((x) => x.user === message.author.id)) {
  }
};
