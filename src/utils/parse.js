module.exports.user = function (client, message, args) {
  let mention = message.mentions.members.first();
  if (mention) {
    return client.users.cache.get(mention.id);
  }
  if (args.length > 0) {
    let id = client.users.cache.find((user) => args.find((x) => user.id == x));
    let username = client.users.cache.find(
      (user) => user.username == args.join(" ")
    );
    let get = message.guild.members.cache.find(
      (user) => user.displayName == args.join(" ")
    );
    let member = get ? client.users.cache.get(get.id) : false;
    return id || username || member;
  }
  return;
};
