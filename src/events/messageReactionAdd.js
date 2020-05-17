module.exports = {
  name: "messageReactionAdd",
  plugins: ["reactionRoles"],
  event(client, { reactionRoles }, reaction, user) {
    const message = reaction.message;
    if (reactionRoles.get(message.id)) {
      reactionRoles.addUser(user);
    }
  },
};
