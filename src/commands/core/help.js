module.exports = {
  aliases: ["h", "help", "commands"],
  use: process.conf.prefix + "help",
  desc: "View this help block",
};

module.exports.run = async (client, message, args, { commands }) => {
  commands = Array.from(commands)
    .filter((x) => x[0] == x[1].use.split(" ")[0].split(process.conf.prefix)[1])
    .map((x) => ({ ...x[1], name: x[0] }));
  commands.sort(() => 0.5 - Math.random());

  const final = `\`\`\`asciidoc
= Commands of ${client.user.tag} =

usage: ${process.conf.prefix}[command] [...args]
example: ${commands[0].use}

${commands
  .map(
    (x) =>
      x.use +
      "\n[Aliases]     :: " +
      x.aliases.join(", ") +
      "\n[Description] :: " +
      x.desc
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
