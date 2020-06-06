module.exports = {
    name: "guildMemberAdd",
    event(client, member) {
        const {
            settings
        } = Plugins;
        if (!Plugins.email || !process.conf.email.enabled) return;
        if (!settings.getGuild(member.guild).email) return;
        if (!settings.getGuild(member.guild).email.value) return;
        const Email = Plugins.email.init(member, client);
        Email.slideIntoDms(member.guild.id);
    },
};