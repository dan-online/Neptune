module.exports = {
  aliases: ["h", "help", "commands"],
  use: process.conf.prefix + "help <category>",
  desc: "View this help block",
};

module.exports.run = async (client, message, args, { commands }) => {
  commands = Array.from(commands)
    .filter((x) => x[0] == x[1].use.split(" ")[0].split(process.conf.prefix)[1])
    .map((x) => ({ ...x[1], name: x[0] }));
  const categories = [];
  commands.forEach((c) => {
    let found = categories.find((x) => x.name == c.category);
    if (found) {
      found.commands.push(c);
    } else {
      categories.push({ name: c.category, commands: [c] });
    }
  });
  const category = args[0] ? args[0].toLowerCase() : false;
  const foundCategory = categories.find(
    (x) => x.name.toLowerCase() == category
  );
  if (!category || !foundCategory) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Command categories!")
      .setColor(process.conf.color);
    categories.forEach((category) => {
      embed.addField(
        category.name,
        module.exports.use.split("<category>").join(category.name) +
          "\n" +
          category.commands.length +
          " commands",
        true
      );
    });
    return message.channel.send(embed);
  }
  commands = foundCategory.commands;
  const final = `\`\`\`asciidoc
= ${category} commands of ${client.user.tag} =

usage: ${process.conf.prefix}[command] [...args]
example: ${commands[0].use}

${commands
  .map(
    (x) =>
      x.use +
      "\n[Aliases]     :: " +
      x.aliases.join(", ") +
      "\n[Description] :: " +
      x.desc +
      (x.permissions ? "\n[Permissions] :: " + x.permissions.join(", ") : "")
  )
  .join("\n\n")}
  
= Created by ${
    typeof process.conf.owner == "string"
      ? client.users.cache.get(process.conf.owner).tag
      : process.conf.owner
          .map((o) => client.users.cache.get(o).tag)
          .join(" and ")
  } = 
\`\`\`
`;
  message.channel.send(final);
};
