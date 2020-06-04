module.exports = {
    name: "guildMemberAdd",
    event(client, member) {
        const {
            settings
        } = Plugins;
        if (!Plugins.email || !process.conf.email.enabled || !settings.getGuild(member.guild).email.value) return;
        const Email = Plugins.email.init(member);
        Email.slideIntoDms();
    },
};