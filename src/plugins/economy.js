const {
  Guild
} = require("discord.js");

// wow this gonna be a big file
const { addSuffix } = require("../utils/utils");

class Economy extends Enmap {
  constructor(config) {
    if (!process.conf.economy.currency) {
      process.conf.economy.currency = " coins";
    }
    super(process.conf.persistent ? {
      name: "economy"
    } : null);
    this.config = config || {};
    return this;
  }
  initGuild(guild) {
    return new GuildEconomy(guild, this);
  }
  init(member, guild) {
    return new UserEconomy(member, guild, this);
  }
}

class GuildEconomy {
  constructor(guild, db) {
    this.guild = guild;
    this.db = db;
    this.doc = this.db.get(guild.id + "_custom") || {
      items: []
    };
    return this;
  }
  items() {
    return this.doc.items || [];
  }
}

class UserEconomy {
  constructor(member, guild, db) {
    if (!member) throw new Error("You must specifiy a user!");
    if (member.user.bot) throw new Error("User can not be a bot!");
    this.member = member;
    this.guild = guild;
    this.db = db;
    this.fetchBalances();
    this.checkUser();
    return this;
  }
  fetchBalances() {
    this.balances = this.db.get(this.guild.id) || [];
    return this.balances;
  }
  save() {
    this.db.set(this.guild.id, this.balances);
    return this.balances;
  }
  saveUser() {
    this.balances[
      this.balances.findIndex((b) => b.member.id == this.member.id)
    ] = this.doc;
    this.save();
    return this.balances;
  }
  checkUser() {
    this.doc = this.balances.find((b) => b.member.id == this.member.id);
    if (!this.doc) {
      this.doc = {
        member: {
          id: this.member.id,
          displayName: this.member.displayName
        },
        balance: 0,
        items: [],
      };
      this.balances.push(this.doc);
      this.save();
    }
    this.doc.balance = parseInt(this.doc.balance);
    return this.doc;
  }
  balance() {
    return this.doc.balance;
  }
  add(amount) {
    this.doc.balance += amount;
    this.saveUser();
    return this.doc.balance;
  }
  remove(amount) {
    if (this.doc.balance - amount < 0)
      throw new Error("This user does not have enough!");
    this.doc.balance -= amount;
    this.saveUser();
    return this.doc.balance;
  }
  transfer(amount, target) {
    if (!(target instanceof UserEconomy))
      throw new Error("Not instances of economy!");
    this.remove(amount);
    target.add(amount);
    return {
      user: this,
      target
    };
  }
  position(formatted) {
    let sorted = this.balances.sort((b, a) => a.balance - b.balance);
    let place =
      sorted.findIndex((user) => user.member.id == this.member.id) + 1;
    return formatted ? addSuffix(place) : place;
  }
}

// class Economy extends Enmap {
//   constructor(config) {
//     if (!process.conf.economy.currency) {
//       process.conf.economy.currency = " coins";
//     } else if (!process.conf.economy.currency.startsWith(" ")) {
//       process.conf.economy.currency = " " + process.conf.economy.currency;
//     }
//     super(process.conf.persistent ? { name: "economy" } : null);
//     this.config = config || {};
//     return this;
//   }
//   init(member, guild) {
//     return this.getFullDoc(member, guild);
//   }
//   getFullDoc(member, guild) {
//     console.log(this);
//     var guildBalances = this.db.get(guild.id);
//     if (!guildBalances) {
//       this.db.set(guild.id, []);
//       guildBalances = [];
//     }
//     console.log(guildBalances);
//     var userBalance = guildBalances.find((x) => x.member.id == member.id);
//     if (!userBalance) {
//       userBalance = {
//         member: {
//           id: member.id,
//           displayName: member.displayName,
//         },
//         balance: 0,
//         items: [],
//       };
//       guildBalances.push(userBalance);
//       this.db.set(guild.id, guildBalances);
//     }
//     console.log(userBalance);
//     let sorted = guildBalances.sort((b, a) => a.balance - b.balance);
//     let place = sorted.findIndex((user) => user.member.id == member.id) + 1;
//     userBalance.formatPlace = addSuffix(place);
//     userBalance.place = place;
//     return userBalance;
//   }
// }

module.exports = Economy;