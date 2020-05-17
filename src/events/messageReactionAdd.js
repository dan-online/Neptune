module.exports = {
  name: "messageReactionAdd",
  plugins: ["reactionRoles"],
  event(client, plugins, message) {
    console.log(plugins);
  },
};
