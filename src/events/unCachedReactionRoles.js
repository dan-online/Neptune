module.exports = {
  name: "raw",
  event(client, packet) {
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
      return;
    const channel = client.channels.resolve(packet.d.channel_id);
    const cached = channel.messages.cache.get(packet.d.message_id) ? true : false;
    channel.messages
      .fetch({
        around: packet.d.message_id,
        limit: 1
      })
      .then((message) => {
        if (!message) return;
        message = message.first();
        const emoji = packet.d.emoji.id ?
          packet.d.emoji.id :
          packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji);
        if (reaction)
          reaction.users.cache.set(
            packet.d.user_id,
            client.users.resolve(packet.d.user_id)
          );
        if (packet.t === "MESSAGE_REACTION_ADD") {
          if (cached) return;
          client.emit(
            "messageReactionAdd",
            reaction,
            client.users.resolve(packet.d.user_id)
          );
        }
        if (packet.t === "MESSAGE_REACTION_REMOVE") {
          client.emit(
            "messageReactionRemove",
            reaction,
            client.users.resolve(packet.d.user_id)
          );
        }
      })
      .catch(console.error);
  },
};