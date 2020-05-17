module.exports = {
  name: "rateLimit",
  event(client, info) {
    console.log("RATELIMIT", info);
  },
};
