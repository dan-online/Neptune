module.exports = {
  aliases: ["ticket", "t"],
  use:
    process.conf.prefix + "ticket <command (open/close/list)> <reason/option>",
  desc: "Open a ticket for support",
  disabled: !(process.conf.tickets && process.conf.tickets.enabled),
};

module.exports.run = async (client, message, args) => {
  const { tickets } = Plugins;
  var guildTickets = tickets.fetch(message.guild.id) || [];
  const openTicket = guildTickets.find(
    (x) => x.user === message.author.id && x.status.open == true
  );
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
      if (args[1] && !isNaN(args[1])) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
          throw new Error("Only an admin can close other tickets!");
        let ticketToClose = guildTickets.find((x) => x.number == args[1]);
        if (!ticketToClose) throw new Error("No ticket with that ID found!");
        if (!args.find((x) => x == "YES")) {
          return message.channel.send(
            "To continue run the command again with ``YES``"
          );
        } else {
          tickets.close(message.author, message.guild, args[1]);
          if (ticketToClose.channel != message.channel.id)
            message.channel.send("Ticket has been closed successfully!");
        }
      } else {
        if (!openTicket)
          throw new Error(
            "You didn't specify a ticket to close and you don't have an open ticket"
          );
        if (!args.find((x) => x == "YES")) {
          throw new Error("To continue run the command again with ``YES``");
        } else {
          tickets.close(message.author, message.guild, openTicket.number);
          message.channel.send("Ticket has been closed successfully!");
        }
      }
      break;
    case "list":
      if (args[1] == "open")
        guildTickets = guildTickets.filter((x) => x.status.open);
      if (guildTickets.length < 1)
        return message.channel.send(":tada: No open tickets!");
      guildTickets
        .reduce((prev, curr) => {
          if (!prev || !prev[0]) {
            return [[curr]];
          }
          if (prev[prev.length - 1].length > 2) {
            prev.push([curr]);
            return prev;
          } else {
            prev[prev.length - 1].push(curr);
            return prev;
          }
        }, [])
        .forEach((tick) => {
          const embed = new Discord.MessageEmbed();
          embed.setColor(process.conf.color);
          tick.forEach((ticket, index) => {
            client.users.fetch(ticket.status.mod).then((mod) => {
              client.users.fetch(ticket.user).then((user) => {
                embed.addField(
                  "Ticket " + ticket.number,
                  `Status: ${ticket.status.open ? "opened" : "closed"} ${
                    mod.id != user.id ? mod.tag : ""
                  }\nCreated: ${new Date(
                    ticket.date
                  ).toLocaleString()}\nUser: ${user.tag}\nReason: ${
                    ticket.reason
                  }`,
                  true
                );
                if (index == tick.length - 1) {
                  message.channel.send(embed);
                }
              });
            });
          });
        });
      break;
    case "view":
      const id = args.find((x) => !isNaN(x));
      const ticket = guildTickets.find((x) => x.number == id);
      if (!ticket) throw new Error("Ticket " + id + " was not found!");
      const embed = new Discord.MessageEmbed()
        .setColor(process.conf.color)
        .setTitle("Ticket " + ticket.number)
        .setDescription(
          `Ticket: ${ticket.number}\nReason: ${ticket.reason}\nUser: ${
            client.users.cache.get(ticket.user).tag
          }\nDate: ${new Date(ticket.date).toLocaleString()}\n Status: ${
            ticket.status.open ? "opened" : "closed"
          } by <@${ticket.status.mod || ticket.user}>`
        )
        .attachFiles({
          name: `transcript-${ticket.number}-${ticket.user}.txt`,
          attachment: Buffer.from(
            ticket.transcript
              .map((x) => `${x.author}: ${x.content}`)
              .join("\n\n")
          ),
        });
      message.channel.send(embed);
      break;
    default:
      throw new Error(args[0] ? "Invalid command" : "No command provided");
  }
};
