module.exports = {
  aliases: ["changes", "changelog", "cl"],
  use: process.conf.prefix + "changelog",
  desc: "View the changelog of Neptune",
};
/**
 * This command finds commits on github
 * @function
 * @param {Discord.Client} client - The client connection
 * @param {Discord.Message} message - The message sent by the user
 * @alias Changelog
 */
async function helpCommand(client, message) {
  const embed = new Discord.MessageEmbed()
    .setColor(process.conf.color)
    .setTitle("Changelog");
  fetch("https://api.github.com/repos/dan-online/Neptune/commits")
    .then((res) => res.json())
    .then((json) => {
        embed.setDescription(json.slice(0, 10).map(x => `[${x.sha.slice(0, 7)}](${x.html_url}) - ${x.commit.message.split("\n")[0]} - [${x.commit.author.name}](${x.author.html_url})`));
        return message.channel.send(embed)
    });
}

module.exports.run = helpCommand;
