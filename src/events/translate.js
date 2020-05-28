module.exports = {
  name: "messageReactionAdd",
  event(client, reaction, user) {
    const Translate = Plugins.translate;
    if (!Translate) return;
    if (user.id == client.user.id) return;
    Translate.translate(
      reaction.message.content,
      reaction.emoji.name,
      (err, res) => {
        if (err) {
          return reaction.message.channel.send(
            "Whoops! Something went wrong: " + err.message
          );
        }
        if (!res || !res.text) {
          return;
        }
        const embed = new Discord.MessageEmbed()
          .setColor(process.conf.color)
          .setThumbnail(user.avatarURL())
          .setTitle("Translation requested by: " + user.tag)
          .addField("Original", reaction.message.content, true)
          .addField("Translation", res.text, true);
        reaction.message.channel.send(embed);
      }
    );
  },
};
