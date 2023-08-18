const BaseCache = require('./BaseMultiCache');

module.exports = class Channel extends BaseCache {
    constructor(client, size = 100) {
        super(size * 100);
        this.client = client;
    }

    async fetch(...ids) {
        let channel = await this.client.API.get(`/guilds/${ids[0]}/channels/${ids[1]}`);
        if (!channel) return null;

        // Save the channel to the cache
        super().set(ids[1], channel.id, channel);

        return channel;
    }
}