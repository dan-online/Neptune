module.exports = {
  aliases: ["changes", "changelog", "cl"],
  use: process.conf.prefix + "changelog",
  desc: "View the changelog of Neptune",
};
var cachedChangelog = {};
/**
 * This command finds commits on github
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @alias Changelog
 */
async function changelogCommand(client, message) {
  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setTitle("Changelog");
  if (!cachedChangelog.date || new Date() - cachedChangelog.date >= 60000) {
    fetch("https://api.github.com/repos/dan-online/Neptune/commits")
      .then((res) => res.json())
      .then(handleData)
      .catch((err) =>
        message.channel.send(
          "Something went wrong when fetching from github: " + err.message
        )
      );
    cachedChangelog.date = new Date();
  } else {
    handleData(cachedChangelog.data);
  }
  function handleData(json) {
    cachedChangelog.data = json;
    embed.setDescription(
      json
        .slice(0, 10)
        .map(
          (x) =>
            `[${x.sha.slice(0, 7)}](${x.html_url}) - ${
              x.commit.message.split("\n")[0]
            } - [${x.commit.author.name}](${x.author.html_url})`
        )
    );
    return message.channel.send(embed);
  }
}

module.exports.run = changelogCommand;
