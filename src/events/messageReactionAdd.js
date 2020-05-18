module.exports = {
  name: "messageReactionAdd",
  plugins: ["reactionRoles"],
  event(client, { reactionRoles }, reaction, user) {
    if (user.id == client.user.id) return;

    const message = reaction.message;
    const guild = reaction.message.guild;
    if (reactionRoles.get(message.id)) {
      reactionRoles.addUser(user, message, reaction, guild);
    }
  },
};
