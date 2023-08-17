const BaseCache = require('./BaseMultiCache');
const SizeLimitedMultiKeyMap = require('../../DataStructures/SizeLimitedMultiKeyMap.js');

module.exports = class EmojiCache extends BaseCache {
    constructor(client, maxCacheSize = 100) {
        super(maxCacheSize * 100);
        this.client = client;
        this.cache = new SizeLimitedMultiKeyMap(maxCacheSize);
    }

    set (guildID, emojiID, data) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (typeof emojiID !== 'string') throw new TypeError('Emoji ID must be a string');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');

        this.cache.set(guildID, emojiID, data);
        return this;
    }

    async get (guildID, emojiID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (emojiID && typeof emojiID !== 'string') throw new TypeError('Emoji ID must be a string');

        console.log(guildID, emojiID);
        if (!this.cache.has(guildID, emojiID)) {
            let emoji = await this.client.API.get(`/guilds/${guildID}/emojis/${emojiID}`);
            this.set(guildID, emojiID, emoji);
            return emoji;
        }

        return this.cache.get(guildID, emojiID);
    }

    has (guildID, emojiID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (emojiID && typeof emojiID !== 'string') throw new TypeError('Emoji ID must be a string');

        if (!emojiID) {
            return this.cache.hasAny(guildID);
        }

        return this.cache.has(guildID, emojiID);
    }

    delete (guildID, emojiID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (typeof emojiID !== 'string') throw new TypeError('Emoji ID must be a string');

        return this.cache.delete(guildID, emojiID);
    }

    random (guildID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        let values = this.cache.getAny(guildID);
        return values[Math.floor(Math.random() * values.length)];
    }

    get [Symbol.iterator]() {
        return this.cache[Symbol.iterator];
    }

}