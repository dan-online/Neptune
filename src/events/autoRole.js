module.exports = {
  name: "guildMemberAdd",
  plugins: ["settings"],
  event(client, { settings }, member) {
    const guildSettings = settings.getGuild(member.guild);
    if (guildSettings.autoRole) {
      member.guild.roles
        .fetch(guildSettings.autoRole.value)
        .then((role) => {
          member.roles.add(role);
        })
        .catch((err) => {
          settings.setVal("autoRole", null);
        });
    }
  },
};
