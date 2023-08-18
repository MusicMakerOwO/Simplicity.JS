const BaseCache = require('./BaseSingleCache.js');

module.exports = class User extends BaseCache {
    constructor(client, size = 100) {
        super(size * 100);
        this.client = client;
    }

    async fetch(id) {
        let user = await this.client.API.get(`/users/${id}`);
        if (!user) return null;

        // Save the user to the cache
        super().set(user.id, user);

        return user;
    }

}