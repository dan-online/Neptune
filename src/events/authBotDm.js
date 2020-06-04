module.exports = {
    name: "message",
    event(client, message) {
        if (!process.conf.email || !Plugins.email || !process.conf.email.enabled) {
            return;
        }
        if (message.channel.type != "dm") {
            return;
        }
        if (message.author.bot) {
            return;
        }
        const Email = Plugins.email.init(message.author)
        Email.verification(message);
    },
};