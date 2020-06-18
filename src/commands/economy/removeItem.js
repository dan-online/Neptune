module.exports = {
    aliases: ["removeItem", "remove-item", "removei", "removeItems"],
    use: process.conf.prefix + "removeItem <name>",
    desc: "Remove an item to the guilds items store",
    disabled: !(process.conf.economy && process.conf.economy.enabled),
    permissions: ["MANAGE_SERVER"],
};

module.exports.run = async (client, message, args) => {
    console.log(args);
    if (!args.parsed["name"]) {
        throw new Error("Provide an item to parse!");
    }
    const item = args.parsed["name"];
    const guildEcon = Plugins.economy.initGuild(message.guild);
    guildEcon.removeItem(item);
    message.channel.send("Item successfuly removed!");
}