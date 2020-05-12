module.exports = {
  name: "ready",
  event(client) {
    log.info(
      `${client.user.username} started in ${client.guilds.cache.size} guilds`
    );
  },
};
