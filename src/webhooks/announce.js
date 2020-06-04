function handle(req, res, client) {
    try {
        const message = req.body.message;
        const channel_name = req.body.channel;
        client.guilds.cache.forEach(guild => {
            const channel = guild.channels.cache.find(channel => {
                return channel.name == channel_name
            })
            if (channel) {
                channel.send(message);
            }
        })
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = handle;