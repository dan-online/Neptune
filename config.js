module.exports = {
  prefix: "t!",
  owner: ["312551747027468290", "209300151485988864"],
  color: "#00ffe1",
  emojis: {
    err: { id: "🔴", full: ":red_circle:" },
    success: { id: "✅", full: "g:white_check_mark:" },
  },
  persistent: true,
  mods: { enabled: true },
  website: { enabled: true, status: true, port: "8080" },
  webhooks: {
    enabled: true,
    paths: [
      {
        icon: "https://dancodes.online/assets/images/me.png",
        name: "Test",
        path: "test",
        map: "New test from {{name}}",
        debug: true,
        secret: { key: "123" },
        channel: "596047625736814614",
      },
    ],
  },
  settings: { enabled: true, autoRole: true },
  tickets: { enabled: true },
  reactionRoles: { enabled: true },
  welcome: {
    enabled: true,
    channel: "bot-testing-zone",
    accentColor: "#7289DA",
    fontPath: ["src", "assets", "fonts", "Poppins-Regular.ttf"],
  },
  app: { enabled: true, port: 3000 },
  economy: { enabled: true, currency: " coins" },
};
