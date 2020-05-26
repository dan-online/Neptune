const emojiMap = require("emoji-unicode-to-name");
const yandexTranslate = require("yandex-translate")(process.env.YANDEX_TOKEN);
class TranslateWrapper {
    constructor(config) {
        return this;
    }
    translate(message, emoji, cb) {
        console.log(emojiMap.get(emoji));

        yandexTranslate.translate(message, {
            "to": emojiMap.get(emoji)
        }, (err, res) => {
            cb(err, res)
        })
    }
}

module.exports = TranslateWrapper;