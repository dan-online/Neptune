class Email extends Enmap {
    constructor(config) {
        super(process.conf.persistant ? {
            name: "email"
        } : null)
        this.config = config || {}
        return this;
    }
    init(member) {
        return new EmailUser(member, this)
    }
}

class EmailUser {
    constructor(member, db) {
        if (member.bot) throw new Error("User cannot be a bot!");
        this.member = member;
        this.db = db;
    }
    slideIntoDms() {
        const user = {
            "pending": true
        }
        this.db.set(this.member.id, user);
        this.member.user.send("Respond with yes to begin verification!");
    }
    verification(message) {
        const user = this.db.get(this.member.id);
        if (!user || !user.pending) return;
        if (message.content.toLowerCase() != "yes") {
            const repUser = {
                "pending": true,
                verification: false
            };
            this.db.set(this.member.id, repUser);
            return;
        }
        if (user.verification === false) {
            this.member.send("Please rejoin the channel to be able to verify");
            return
        }
        const repUser = {
            "pending": true
        }
        this.db.set(this.member.id, repUser);
        this.member.user.send("Please respond with your email address");
        //regex for email
    }

}

module.exports = Email;