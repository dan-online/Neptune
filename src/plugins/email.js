const { validateEmail } = require("../utils/utils");
const nodemailer = require("nodemailer");
class Email extends Enmap {
  constructor(config) {
    super(
      process.conf.persistant
        ? {
            name: "email",
          }
        : null
    );
    this.config = config || {};
    this.transport = nodemailer.createTransport({
      service: process.conf.email.service
        ? process.conf.email.service
        : "gmail",
      auth: {
        user: process.conf.email.username,
        pass: process.conf.email.password,
      },
    });
    if (!validateEmail(process.conf.email.username)) {
      console.error("Email is not configured properly");
    }
    if (!process.conf.email.password) {
      console.error("Password is not configured properly (undefined)");
    }

    return this;
  }
  init(member) {
    return new EmailUser(member, this);
  }
}

class EmailUser {
  constructor(member, db) {
    if (member.bot) throw new Error("User cannot be a bot!");
    this.member = member;
    this.db = db;
  }
  slideIntoDms() {
    const prevUser = this.db.get(this.member.id);
    if (prevUser && prevUser.verification === true) {
      this.member.send("User already verified!");
      return;
    }

    const user = {
      pending: true,
      verification: false,
    };
    this.db.set(this.member.id, user);
    this.member.send("Respond with yes to begin verification!");
  }
  verificationFail() {
    const user = {
      pending: false,
      verification: false,
    };
    this.member.send("Please rejoin channel to begin verification!");
  }

  verification(message) {
    let user = this.db.get(this.member.id);
    if (user.verification === true) {
      return;
    }
    if (user.pending === "cancelled") {
      return;
    }
    if (user.pending === "in process") {
      return;
    }

    if (message.content.toLowerCase() == "yes") {
      if (user.pending === false) {
        this.verificationFail();
        return;
      }
      const filter = collected => {
        return collected.author.id === this.member.id;
      };
      this.member
        .send(
          'Please respond with your email or "cancel" to cancel verification'
        )
        .then(messageRaw => {
          const repUser = {
            pending: "in process",
            verification: false,
          };
          this.db.set(this.member.id, repUser);
          const messageListener = message => {
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 50000,
              })
              .then(response => {
                if (response.first().content === "cancel") {
                  const repUser = {
                    pending: "cancelled",
                    verification: false,
                  };
                  this.db.set(this.member.id, repUser);
                  this.member.send("Verification cancelled!");
                  return;
                }
                if (validateEmail(response.first().content)) {
                  this.sendCode(response.first().content, (message, code) => {
                    message.channel
                      .awaitMessages(filter, {
                        max: 1,
                        time: 50000,
                      })
                      .then(response => {
                        console.log(code, response.first().content);
                        if (response.first().content == code) {
                          const repUser = {
                            pending: false,
                            verification: true,
                          };
                          this.db.set(this.member.id, repUser);
                          this.member.send("Verification complete!");
                          return;
                        }
                        this.member.send(
                          "Verification failed! Please rejoin server to complete verification"
                        );
                      });
                  });
                  return;
                }
                this.member
                  .send("Please retype the email properly!")
                  .then(m => {
                    messageListener(m);
                  });
                return;
              })
              .catch(() => {});
          };
          messageListener(messageRaw);
        });

      return;
    } else {
      // this.verificationFail();
    }
  }
  sendCode(email, cb) {
    const code = Math.floor(100000 + Math.random() * 900000);
    var mailOptions = {
      from: process.conf.email.username,
      to: email,
      subject: process.conf.email.subject
        ? process.conf.email.subject
        : "Discord verification code",
      text: process.conf.email.text
        ? process.conf.email.text.replace("<code>", code)
        : "Your verification code is: " + code,
    };
    this.db.transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(info);
      const user = {
        pending: "code",
        code: code,
      };
      this.db.set(this.member.id, user);
      this.member
        .send("Please check your email and type in the code!")
        .then(message => {
          cb(message, code);
        });
    });
    //send mail
  }
}

module.exports = Email;
