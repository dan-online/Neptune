module.exports = {
  name: "messageReactionRemove",
  plugins: ["reactionRoles"],
  event(client, { reactionRoles }, reaction, user) {
    if (user.id == client.user.id) return;

    const message = reaction.message;
    if (reactionRoles.get(message.id)) {
      reactionRoles.removeUser(user, message, reaction);
    }
  },
};
