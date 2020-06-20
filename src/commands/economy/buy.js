    module.exports = {
        aliases: ["buy", "b", "buyItem"],
        use: process.conf.prefix + "buy <name>",
        desc: "Buy an item from the guilds items store",
        disabled: !(process.conf.economy && process.conf.economy.enabled)
    };

    module.exports.run = async (client, message, args) => {
        const name = args.parsed["name"];
        if (!name) {
            throw new Error("Please provide an item name");
        }
        const userEcon = Plugins.economy.init(message.member, message.guild);
        const guildEcon = Plugins.economy.initGuild(message.guild);
        userEcon.buyItem(name, guildEcon);
        message.channel.send("Item bought! Check your inventory using \"t!inventory\"");
    }