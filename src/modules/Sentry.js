if (process.env.Sentry) {
  var Sentry = require("@sentry/node");
  Sentry.init({ dsn: process.env.SENTRY });
}
module.exports = {
  module: process.env.SENTRY ? Sentry : { captureException: () => false },
  name: "Sentry",
};
