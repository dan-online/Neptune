
var Sentry = require("@sentry/node");
if (process.env.Sentry) {
  Sentry.init({ dsn: process.env.SENTRY });
}
module.exports = {
  module: process.env.SENTRY ? Sentry : { captureException: () => false },
  name: "Sentry",
};
