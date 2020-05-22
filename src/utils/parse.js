module.exports = function (client, message, args) {
  let finalUser;

  if (message.mentions.members.first()) {
    finalUser = message.mentions.members.first();
  } else if (args.length > 1) {
    let id = args.find((x) => client.users.cache.get(x));
    let username = args.find((x) =>
      client.users.cache.find((d) => d.username == x)
    );
    let member = message.guild
      ? args.find((x) => message.guild.members.find((d) => d.displayName == x))
      : false;
    finalUser = id || username || member;
  }

  return finalUser;
};
