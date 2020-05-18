module.exports = {
  name: "rateLimit",
  event(client, plugins, info) {
    log("lmit")(
      "ratelimited for " +
        info.limit +
        " actions and " +
        Math.round((info.timeout / 1000) * 100) / 100 +
        "s"
    );
  },
};
