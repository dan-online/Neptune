module.exports = {
    aliases: ["pause"],
    use: process.conf.prefix + "pause",
    desc: "Pause music",
    // disabled: !(process.conf.music && process.conf.economy.music),
};

module.exports.run = async (client, message, args) => {
    const musicManager = Plugins.music;
    if (!musicManager) return;
    try {
        musicManager.pause(client, message);
    } catch (err) {
        throw new Error(err);
    }
};