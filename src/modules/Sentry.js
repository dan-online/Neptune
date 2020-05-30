module.exports = {
  module: process.env.SENTRY
    ? (() => {
        const Sentry = require("@sentry/node");
        Sentry.init({ dsn: process.env.SENTRY });
        return Sentry;
      })()
    : { captureException: () => false },
  name: "Sentry",
};
