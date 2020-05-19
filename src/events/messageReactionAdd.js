module.exports = {
  name: "messageReactionAdd",
  event(client, reaction, user) {
    const { reactionRoles } = Plugins;
    if (!reactionRoles) return;
    if (user.id == client.user.id) return;

    const message = reaction.message;
    const guild = reaction.message.guild;
    if (reactionRoles.getID(message.id)) {
      reactionRoles.addUser(user, message, reaction, guild);
    }
  },
};
