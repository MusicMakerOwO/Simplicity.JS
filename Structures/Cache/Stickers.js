const BaseCache = require('./BaseCache.js');

module.exports = class Sticker extends BaseCache {
    constructor(client, size = 100) {
        super(client, size * 20);
        this.client = client;
    }

    async fetch(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');
        return await this.client.API.get(`/stickers/${id}`, options);
    }
}