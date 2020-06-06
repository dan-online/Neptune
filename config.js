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
  email: {
    enabled: true,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    service: "gmail",
    role: {
      data: {
        name: "Verified"

      }
    }
  },
  settings: {
    enabled: true,
    autoRole: false,
  },
  // tickets: {
  //   enabled: true,
  // },
  // reactionRoles: {
  //   enabled: true,
  // },
};