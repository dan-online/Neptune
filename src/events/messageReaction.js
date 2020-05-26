module.exports = {
    name: "messageReactionAdd",
    event(client, reaction, user) {
        const Translate = Plugins.translate;
        if (!Translate) return;
        if (user.id == client.user.id) return;
        console.log(reaction.emoji.name)
    }
}