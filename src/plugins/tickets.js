module.exports = class Tickets extends Enmap {
  constructor(config) {
    super(
      process.conf.persistent
        ? { name: "tickets", polling: true, pollingInterval: 200 }
        : null
    );
    this.config = config;
    return this;
  }
  open(user, guild, reason) {
    this.tickets = this.fetch(guild.id) || [];
    console.log(this.tickets.length);
    this.guild = guild;
    let ticketNumber = this.tickets.length + 1;
    guild.channels
      .create(ticketNumber, {
        type: "text",
        topic: "Ticket " + ticketNumber + ": " + reason,
        position: 0,
        reason: "ticket made by " + user.tag,
      })
      .then((channel) => {
        channel.updateOverwrite(user.id, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true,
          VIEW_CHANNEL: true,
        });
        channel.updateOverwrite(channel.guild.roles.everyone, {
          VIEW_CHANNEL: false,
        });
        this.tickets.push({
          number: ticketNumber,
          reason,
          date: new Date(),
          channel: channel.id,
          user: user.id,
        });
        this.set(guild.id, this.tickets);
        channel.send(
          new Discord.MessageEmbed()
            .setTitle("Ticket #" + ticketNumber)
            .setDescription(
              `User: ${user}\nDescription: ${reason}\nDate: ${new Date().toLocaleString()}`
            )
            .setColor(process.conf.color)
            .setTimestamp()
        );
      });
    return ticketNumber;
  }
};
