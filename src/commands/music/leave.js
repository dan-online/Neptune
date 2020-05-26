module.exports = {
    aliases: ["leave"],
    use: process.conf.prefix + "leave",
    desc: "Leave voice chat",
    // disabled: !(process.conf.music && process.conf.economy.music),
};

module.exports.run = async (client, message, args) => {
    const musicManager = Plugins.music;
    if (!musicManager) return;

    musicManager.leave(client, message);

}