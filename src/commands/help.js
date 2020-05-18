module.exports = {
  aliases: ["h", "help", "commands"],
  use: process.conf.prefix + "help",
  desc: "View this help block",
};

module.exports.run = async (client, message, args, { commands }) => {
  commands = Array.from(commands)
    .filter((x) => x[0] == x[1].use.split(" ")[0].split(process.conf.prefix)[1])
    .map((x) => ({ ...x[1], name: x[0] }));

  let tab = Array(
    commands.sort((y, x) => x.use.length - y.use.length)[0].use.length + 2
  )
    .fill(" ")
    .join("");

  const final = `\`\`\`asciidoc
= Commands of ${client.user.tag} =

usage: ${process.conf.prefix}[command] [...args]
exmpl: ${commands[0].use}

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
  
= Created by ${client.users.cache.get(process.conf.owner).tag} = 
\`\`\`
`;
  message.channel.send(final);
};
