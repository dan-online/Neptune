module.exports = {
    name: "guildMemberAdd",
    event(client, member) {
        const welcome = Plugins.welcome;
        if (!welcome) return;
        if (!member) {
            throw new Error("Member not found!");
        }
        try {
            welcome.welcome(client, member);
        } catch (error) {
            throw new Error(error);
        }
    }
}