module.exports.member = function (client, message, args) {
  let mention = message.mentions.members.first();
  if (mention) {
    return mention;
  }
  if (args.length > 0) {
    let id = message.guild.members.cache.find((user) =>
      args.find((x) => user.id == x)
    );
    let username = message.guild.members.cache.find(
      (user) =>
        user.user.username.toLowerCase() == args.join(" ").toLowerCase() ||
        args.find((x) => user.user.username.toLowerCase() == x.toLowerCase())
    );
    let member = message.guild.members.cache.find(
      (user) =>
        user.displayName.toLowerCase() == args.join(" ").toLowerCase() ||
        args.find((x) => user.displayName.toLowerCase() == x.toLowerCase())
    );
    return id || username || member;
  }
  return;
};

module.exports.role = function (client, message, args) {
  let mention = message.mentions.roles.first();
  if (mention) {
    return mention;
  }
  if (args.length > 0) {
    let id = message.guild.roles.cache.find((user) =>
      args.find((x) => user.id == x)
    );
    let name = message.guild.roles.cache.find(
      (role) =>
        role.name.toLowerCase() == args.join(" ") ||
        args.find((x) => x.toLowerCase() == role.name.toLowerCase())
    );
    return id || name;
  }
  return;
};
