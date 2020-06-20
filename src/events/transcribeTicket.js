module.exports = {
  name: "message",
  event(client, message) {
    if (!message.guild || message.author.bot || !Plugins.tickets) return;
    const guildTickets = Plugins.tickets.fetch(message.guild.id) || [];
    const channelTicket = guildTickets.find(
      (x) => x.channel == message.channel.id && x.status.open
    );
    if (!channelTicket) return;
    const index = guildTickets.indexOf(channelTicket);
    channelTicket.transcript.push({
      author: message.author.tag,
      content: message.content,
    });
    guildTickets[index] = channelTicket;
    Plugins.tickets.set(message.guild.id, guildTickets);
    return;
  },
};
