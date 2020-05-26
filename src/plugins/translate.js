const emojiMap = require("emoji-unicode-to-name");
const googleTranslate = require("google-translate-api");
class TranslateWrapper {
    constructor(config) {
        return this;
    }
    translate(message, emoji) {
        console.log(emojiMap.get(emoji))

        googleTranslate(message, {
            to: emojiMap.get(emoji)
        }).then(res => {
            console.log(res.text);
        });
    }
}

module.exports = TranslateWrapper;