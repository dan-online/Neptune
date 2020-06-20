module.exports = {
  name: "error",
  event(client, err) {
    log("cerr")(err);
  },
};
