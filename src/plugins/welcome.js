const {
    Canvas
} = require("canvas-constructor");

const {
    loadImage
} = require("canvas");

const {
    resolve,
    join
} = require("path")

Canvas.registerFont(resolve(join(__dirname, process.conf.fontPath)), "default")

class Welcome {
    constructor(config) {
        this.channel = config.channel;
        this.welcomeMessage = config.welcomeMessage ?
            config.welcomeMessage :
            "Welcome!";
        this.leaveMessage = config.leaveMessage ?
            config.leaveMessage :
            "See ya soon!";
        this.channelInits = {};
        this.color = config.accent
    }
    welcome(client, member, self) {
        if (self) {
            self._createCanvas(self, self.welcomeMessage, member)
            return;
        }
        if (this.channelInits[member.guild.id]) {
            this._createCanvas(this, this.welcomeMessage, member);
            return;
        }
        this._checkWelcomeChannel(client, member, this.welcome);
    }
    _createWelcomeChannel(client, member) {
        return member.guild.channels.create(this.channel);
    }
    _checkWelcomeChannel(client, member, cb) {
        this.channelInits[member.guild.id] = member.guild.channels.cache.find(
            channel => channel.name == this.channel
        )
        if (!this.channelInits[member.guild.id]) {
            this._createWelcomeChannel(client, member).then(() => {
                cb(client, member, this);
            });
        } else {
            cb(client, member, this);
        }
    }
    leave(client, member, self) {
        if (this.channelInits[member.guild.id]) {
            //actually welcome user
            return;
        }
        this._checkWelcomeChannel(client, member, this.leave);
    }

    _createCanvas(self, message, member) {
        const avatarUrl = member.user.avatarURL({
            "size": 128,
            format: "png"
        });
        loadImage(avatarUrl).then(image => {
            const canvas = new Canvas(400, 180)
                // https://github.com/kyranet/canvasConstructor/blob/master/guides/Profile%20Card/ProfileCard.md im lazy ok
                .setColor("#7289DA")
                .addRect(84, 0, 316, 180)
                .setColor("#2C2F33")
                .addRect(0, 0, 84, 180)
                .addRect(169, 26, 231, 46)
                .addRect(224, 108, 176, 46)
                .setShadowColor("rgba(22, 22, 22, 1)")
                .setShadowOffsetY(5)
                .setShadowBlur(10)
                .addCircle(84, 90, 62)
                .addCircularImage(image, 84, 88, 64)
                .save()
                .createBeveledClip(20, 138, 128, 32, 5)
                .setColor("#23272A")
                .fill()
                .restore()
                .setTextAlign("center")
                .setTextFont("10pt default")
                .setColor("#FFFFFF")
                .addText(member.nickname, 285, 54)
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
            self.channelInits[member.guild.id].send("", attachment);
        })
    }
}

module.exports = Welcome;