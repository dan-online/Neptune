// wow this gonna be a big file
function addSuffix(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = class Economy extends Enmap {
  constructor(config) {
    if (!process.conf.economy.currency) {
      process.conf.economy.currency = " coins";
    }
    super(process.conf.persistent ? { name: "economy" } : null);
    this.config = config || {};
    return this;
  }
  init(member, guild) {
    this.member = member;
    this.guild = guild;
    this.fetchBalances();
    this.checkUser();
    return this;
  }
  fetchBalances() {
    this.balances = this.get(this.guild.id) || [];
    return this.balances;
  }
  checkUser() {
    this.doc = this.balances.find((b) => b.member.id == this.member.id);
    if (!this.doc) {
      this.doc = {
        member: this.member,
        balance: 0,
        items: [],
      };
      this.balances.push(this.doc);
      this.save();
    }
    return this.doc;
  }
  save() {
    this.set(this.guild.id, this.balances);
    return this.balances;
  }
  saveUser() {
    this.balances[
      this.balances.findIndex((b) => b.member.id == this.member.id)
    ] = this.doc;
    this.save();
    return this.balances;
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
  transfer(amount, user, target) {
    if (!user instanceof Economy || !target instanceof Economy)
      throw new Error("Not instances of economy!");
    user.remove(amount);
    target.add(amount);
    return { user, target };
  }
  position(formatted) {
    let sorted = this.balances.sort((b, a) => a.balance - b.balance);
    let place =
      sorted.findIndex((user) => user.member.id == this.member.id) + 1;
    return formatted ? addSuffix(place) : place;
  }
};
