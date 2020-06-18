module.exports = {
    aliases: ["inventory"],
    use: process.conf.prefix + "inventory",
    desc: "View items in your inventory",
    disabled: !(process.conf.economy && process.conf.economy.enabled),
};

function sendEmbed(itemList, page, guildName) {
    const embed = new Discord.MessageEmbed();
    if (page) {
        embed.setTitle("Items of " + guildName + " (page " + page + ")");
    } else {
        embed.setTitle("Items of " + guildName);
    }
    itemList.forEach((item) => {
        embed.addField(item.name, "**Description**\n" + item.desc + "\n**Price**: " + item.price);
    })
    return embed
}

const {
    ask
} = require("../../utils")


module.exports.run = async (client, message, args) => {
    const userEcon = Plugins.economy.init(message.member, message.guild);
    const items = userEcon.items();
    const doc = {}
    const questions = [{
        question: "Please select a page! (_1-" + Math.ceil(items.length / 5) + "_)",
        test(msg) {
            if (isNaN(msg.content)) throw new Error("Response is not a number!");
        },
        val(msg) {
            return msg.content - 1;
        },
        key: "page"
    }]
    if (items.length > 5) {
        (function askQ(index) {
            const q = questions[index];
            if (!q) return finish();
            ask(
                message,
                q.question,
                q.options || null,
                function (err, msg) {
                    try {
                        if (err) {
                            throw err;
                        }
                        if (!msg.content) {
                            throw new Error("No answer provided!");
                        }
                        if (msg.content.toLowerCase() == "cancel") {
                            throw new Error("Setup canceled!");
                        }
                        if (q.test) {
                            q.test(msg);
                        }
                    } catch (err) {
                        message.channel.send(
                            process.conf.emojis.err.full +
                            "  " +
                            (err.message || "Setup timed out!")
                        );
                        if (err.message) {
                            return askQ(ind);
                        }
                    }
                    doc[q.key] = q.val(msg);
                    askQ(ind + 1);
                }
            );
        })(0);

        function finish() {
            const embed = sendEmbed(items.slice(doc.page, doc.page + 5), doc.page + 1, message.member.displayName);
            message.channel.send(embed);
        }
    } else {
        if (items.length == 0) {
            return message.channel.send("There are no items!");
        }
        const embed = sendEmbed(items, 0, message.member.displayName);
        message.channel.send(embed);
    }
};