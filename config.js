module.exports = {
  prefix: "t!",
  owner: ["312551747027468290", "209300151485988864"], // your discord id
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
  website: {
    enabled: true,
    port: 8080,
    routes: [
      {
        route: "/",
        handler: "../webhooks/home.js",
        method: "GET",
      },
      {
        route: "/announce",
        handler: "../webhooks/announce.js",
        method: "POST",
      },
    ],
  },
  webhooks: {
    enabled: true,
    paths: [
      {
        icon: "https://dancodes.online/assets/images/me.png",
        name: "Test",
        path: "test",
        map: `New test from {{name}}`,
        secret: {
          key: "123",
        },
        channel: "596047625736814614",
        // Post request to /webhooks/test with body: { name: "DanCodes" }
      },
    ],
  },
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
