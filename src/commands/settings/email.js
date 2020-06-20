module.exports = {
    disabled: !(process.conf.email && process.conf.email.enabled),
    permissions: ["ADMINISTRATOR"],
    aliases: ["email"],
    use: process.conf.prefix + "email",
    desc: "Enable or disable the email authentication system",
};

module.exports.run = async (client, message, args) => {
    const {
        settings
    } = Plugins;
    let enabled = settings.getGuild(message.guild).email.value;
    settings.setVal("email", !enabled, "enabled", message.guild);
    settings.save();
    message.channel.send(
        process.conf.emojis.success.full + " Email has been set to **" + !enabled + "**"
    );
};