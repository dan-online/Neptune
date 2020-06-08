const { validateEmail } = require("../utils");
const nodemailer = require("nodemailer");
const emailHtml = fs
  .readFileSync(path.resolve(__dirname, "../assets/email/verify.html"), {
    encoding: "utf-8",
  })
  .split("\n")
  .join("");
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
      throw new Error("Email is not configured properly");
    }
    if (!process.conf.email.password) {
      throw new Error("Password is not configured properly (undefined)");
    }

    return this;
  }
  init(member, client) {
    return new EmailUser(member, this, client);
  }
}

class EmailUser {
  constructor(member, db, client) {
    if (member.bot) throw new Error("User cannot be a bot!");
    this.member = member;
    this.db = db;
    this.role = process.conf.email.role
      ? process.conf.email.role
      : {
          data: {
            name: "Verified",
          },
        };
    this.client = client;
    return this;
  }
  addRole(guildId) {
    console.log(guildId);
    const guild = this.client.guilds.cache.get(guildId);
    const member = guild.member(this.member);
    let role = guild.roles.cache.find((x) => x.name == this.role.name);
    if (!role) {
      guild.roles.create(this.role).then((role) => {
        member.roles
          .add(role)
          .catch((err) =>
            this.member.send(
              "Whoops an error occured while verifying you: " + err.message
            )
          );
      });
      return;
    }
    return member.roles
      .add(role)
      .catch((err) =>
        this.member.send(
          "Whoops an error occured while verifying you: " + err.message
        )
      );
  }
  slideIntoDms(guildId) {
    const prevUser = this.db.get(this.member.id);
    if (prevUser && prevUser.verification === true) {
      this.addRole(prevUser.guildId);
      this.member.send("You have already been verified!");
      return;
    }
    const user = {
      pending: true,
      verification: false,
      guildId: guildId,
    };
    this.db.set(this.member.id, user);
    this.member.send(":smiley: Respond with yes to begin verification!");
  }
  verificationFail(guildId) {
    const user = {
      pending: false,
      verification: false,
      guildId,
    };
    this.member.send('Please type "try again" to restart verification!');
  }

  verification(message) {
    let user = this.db.get(this.member.id);
    if (!user) {
      return this.member.send("Sorry you have to join a guild to be verified!");
    }
    if (user.pending === "in process") {
      return;
    }
    if (message.content.toLowerCase() == "try again") {
      const repUser = {
        pending: true,
        verification: false,
        guildId: user.guildId,
      };
      this.db.set(this.member.id, repUser);
      this.slideIntoDms(user.guildId);
      return;
    }
    if (user.pending === "cancelled") {
      return;
    }
    if (user.pending === "code") {
      return;
    }
    if (message.content.toLowerCase() == "yes") {
      if (user.pending === false) {
        this.verificationFail(user.guildId);
        return;
      }
      const filter = (collected) => {
        return collected.author.id === this.member.id;
      };
      this.member
        .send(
          ':e_mail: Please respond with your email or "cancel" to cancel verification'
        )
        .then((messageRaw) => {
          const repUser = {
            pending: "in process",
            verification: false,
            guildId: user.guildId,
          };
          this.db.set(this.member.id, repUser);
          const messageListener = (message) => {
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000 * 5,
              })
              .then((response) => {
                if (response.first().content === "cancel") {
                  const repUser = {
                    pending: "cancelled",
                    verification: false,
                    guildId: user.guildId,
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
                        time: 300000,
                      })
                      .then((response) => {
                        try {
                          response.first().content;
                        } catch (err) {
                          this.member.send("An error has occured: " + err);
                          return;
                        }
                        if (response.first().content == code) {
                          const repUser = {
                            pending: false,
                            verification: true,
                            guildId: user.guildId,
                          };
                          this.db.set(this.member.id, repUser);
                          this.addRole(user.guildId);
                          this.member.send(":tada: Verification complete!");

                          return;
                        }
                        console.log(response.first().content);
                        this.member.send(
                          'Verification failed! Please type "try again" the server!'
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        this.member.send(
                          'Verification has timed out, please type "try again" the server!'
                        );
                      });
                  });
                  return;
                }
                this.member
                  .send("Please retype the email properly!")
                  .then((m) => {
                    messageListener(m);
                  });
                return;
              })
              .catch(console.error);
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
    let name = process.conf.name[0].toUpperCase() + process.conf.name.slice(1);
    var mailOptions = {
      from: process.conf.name + "@verification.no-reply.com",
      replyTo: process.conf.name + "@verification.no-reply.com",
      to: email,
      subject: name + " verification code",
      html: emailHtml
        .split("{{client_name}}")
        .join(name)
        .split("{{code}}")
        .join(code),
    };
    this.member
      .send(":airplane_departure: Please wait while we send your email...")
      .then((m) => {
        this.db.transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            m.edit("An error has occured: " + err);
            return;
          }
          const user = {
            pending: "code",
            code: code,
          };
          this.db.set(this.member.id, user);
          m.edit(
            ":inbox_tray: Email sent! Check your inbox/spam for a code to verify yourself and send it here."
          ).then((message) => {
            cb(message, code);
          });
        });
      });

    //send mail
  }
}

module.exports = Email;
