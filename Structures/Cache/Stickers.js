const BaseCache = require('./BaseMultiCache.js');

module.exports = class Sticker extends BaseCache {
    constructor(client, size = 100) {
        super(size * 20);
        this.client = client;
    }

    async fetch(...ids) {
        let sticker = await this.client.API.get(`/guilds/${ids[0]}/stickers/${ids[1]}`);
        if (!sticker) return null;

        // Save the sticker to the cache
        super().set(ids[1], sticker.id, sticker);

        return sticker;
    }

}