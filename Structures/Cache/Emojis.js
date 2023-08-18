const BaseCache = require('./BaseMultiCache');

module.exports = class EmojiCache extends BaseCache {
    constructor(client, maxCacheSize = 100) {
        super(maxCacheSize * 100);
        this.client = client;
    }

    async fetch(...ids) {
        let emoji = await this.client.API.get(`/guilds/${ids[0]}/emojis/${ids[1]}`);
        if (!emoji) return null;

        // Save the emoji to the cache
        this.set(ids[1], emoji.id, emoji);

        return emoji;
    }

}