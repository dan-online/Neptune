module.exports = {
  prefix: "t!",
  owner: ["312551747027468290"], // your discord id
  color: "#00ffe1",
  emojis: {
    err: {
      id: "🔴",
      full: ":red_circle:",
    },
    success: {
      id: "✅",
      full: ":white_check_mark:",
    },
  },
  persistent: true,
  economy: {
    enabled: true,
  },
  mods: {
    enabled: true,
  },
  webhooks: {
    enabled: true,
    port: 8080,
    routes: [{
      route: "/",
      handler: "../webhooks/home.js",
      method: "GET"
    }]
  }
  // settings: {
  //   enabled: false,
  //   autoRole: false,
  // },
  // tickets: {
  //   enabled: true,
  // },
  // reactionRoles: {
  //   enabled: true,
  // },
};