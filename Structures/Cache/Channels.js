const BaseCache = require('./BaseMultiCache');

module.exports = class Channel extends BaseCache {
    constructor(client, size = 100) {
        super(size * 100);
        this.client = client;
    }

    async fetch(...ids) {
        return await this.client.API.get(`/guilds/${ids[0]}/channels/${ids[1]}`);
    }
}