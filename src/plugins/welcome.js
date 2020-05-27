class Welcome {
    constructor(config) {
        this.channel = config.channel;
        this.channelInits = {}
    }
    welcome(client, member) {
        if (this.channelInits[member.guild.id]) {
            //actually welcome user 
            return
        }
        this._checkWelcomeChannel(client, member, this.welcome);

    }
    _createWelcomeChannel(client, member) {
        return member.guild.channels.create(this.channel);
    }
    _checkWelcomeChannel(client, member, cb) {
        this.channelInits[member.guild.id] = member.guild.channels.cache.find(channel => channel.name == this.channel) ? true : false;
        if (!this.channelInits[member.guild.id]) {
            this._createWelcomeChannel(client, member).then(() => {
                cb(client, member)
            })
        } else {
            cb(client, member)
        }
    }
    leave(client, member) {
        if (this.channelInits[member.guild.id]) {
            //actually welcome user 
            return
        }
        this._checkWelcomeChannel(client, member, this.leave);
    }
}

module.exports = Welcome;