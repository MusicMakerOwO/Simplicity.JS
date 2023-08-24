const BaseCache = require('./BaseMultiCache.js');

module.exports = class Role extends BaseCache {
    constructor(client, size = 100) {
        super(size * 100);
        this.client = client;
    }

    async fetch(...ids) {
        let role = await this.client.API.get(`/guilds/${ids[0]}/roles/${ids[1]}`);
        if (!role) return null;

        // Save the role to the cache
        this.set(ids[1], role.id, role);

        return role;
    }

}