module.exports = {
  name: "guildMemberAdd",
  event(client, member) {
    if (
      !Plugins.settings ||
      !(process.conf.settings && process.conf.settings.autoRole)
    )
      return;
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
