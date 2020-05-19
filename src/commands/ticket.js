module.exports = {
  plugins: ["tickets"],
  aliases: ["ticket", "t"],
  use: process.conf.prefix + "ticket <command> <reason/option>",
  desc: "Open a ticket for support",
};

module.exports.run = async (client, message, args, { plugins }) => {
  const { tickets } = plugins;
  const guildTickets = tickets.fetch(message.guild.id) || [];
  const openTicket = guildTickets.find((x) => x.user === message.author.id);
  switch (args[0]) {
    case "open":
      if (openTicket) {
        throw new Error("You already have an open ticket!");
      } else {
        if (!args[1]) {
          throw new Error("No reason provided");
        }
        let ticket = tickets.open(
          message.author,
          message.guild,
          args.slice(1).join(" ")
        );
        message.channel.send(
          "Your ticket has been created! Head over to #" + ticket
        );
        break;
      }
    case "close":
      if (!openTicket) {
        if (args[1]) {
          let ticketToClose = guildTickets.find((x) => x.number == args[1]);
          if (!ticketToClose) throw new Error("No ticket with that ID found!");
          if (!args.find((x) => x == "YES")) {
            throw new Error("To continue run the command again with ``YES``");
          } else {
          }
        } else {
          throw new Error(
            "You didn't specify a ticket to close and you don't have an open ticket"
          );
        }
      }
      break;
    default:
      throw new Error(args[0] ? "Invalid command" : "No command provided");
  }
};
