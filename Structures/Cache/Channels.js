const BaseCache = require('./BaseCache');

module.exports = class Channel extends BaseCache {
    constructor(client, size = 100) {
        super(client, size * 100);
        this.client = client;
    }

    async fetch(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');
        return await this.client.API.get(`/channels/${id}`, options);
    }
}