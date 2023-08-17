const BaseCache = require('./BaseSingleCache.js');

module.exports = class User extends BaseCache {
    constructor(client, size = 100) {
        super(size * 100);
        this.client = client;
    }

    async fetch(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');
        return await this.client.API.get(`/users/${id}`, options);
    }
}