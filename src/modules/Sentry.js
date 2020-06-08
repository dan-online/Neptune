if (process.env.SENTRY) {
  var Sentry = require("@sentry/node");
  Sentry.init({ dsn: process.env.SENTRY });
}
module.exports = {
  module: process.env.SENTRY ? Sentry : { captureException: () => false },
  name: "Sentry",
};
