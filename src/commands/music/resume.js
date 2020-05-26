module.exports = {
    aliases: ["resume"],
    use: process.conf.prefix + "resume",
    desc: "Resume music",
    // disabled: !(process.conf.music && process.conf.economy.music),
};

module.exports.run = async (client, message, args) => {
    const musicManager = Plugins.music;
    if (!musicManager) return;
    try {
        musicManager.resume(client, message);
    } catch (err) {
        throw new Error(err);
    }
};