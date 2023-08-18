const BaseCache = require('./BaseSingleCache.js');

module.exports = class Guild extends BaseCache {
    constructor(client, size = 100) {
        super(size);
        this.client = client;
    }

    async fetch(id) {
        let guild = await this.client.API.get(`/guilds/${id}`, options);
        if (!guild) return null;

        // Save the guild to the cache
        super().set(guild.id, guild);

        return guild;
    }

}
