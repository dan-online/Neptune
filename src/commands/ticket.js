module.exports = {
  plugins: ["tickets"],
  aliases: ["ticket", "t"],
  use: process.conf.prefix + "ticket <reason>",
  desc: "Open a ticket for support",
};

module.exports.run = async (client, message, args, { plugins }) => {
  const { tickets } = plugins;
  if (tickets.find((x) => x.user === message.author.id)) {
    return message.channel.send("You already have an open ticket!");
  }
  let ticket = tickets.open(message.author, message.guild, args.join(" "));
  message.channel.send("Your ticket has been created! Head over to #" + ticket);
};
