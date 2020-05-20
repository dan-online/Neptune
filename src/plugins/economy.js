// wow this gonna be a big file

module.exports = class Economy extends Enmap {
  constructor(config) {
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
};
