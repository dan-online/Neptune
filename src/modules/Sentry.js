const Sentry = require("@sentry/node");

module.exports = {
  module: process.env.SENTRY
    ? Sentry.init({ dsn: process.env.SENTRY })
    : { captureException: () => false },
  name: "Sentry",
};
