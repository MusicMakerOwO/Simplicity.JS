const BaseCache = require('./BaseMultiCache');

module.exports = class MemberCache extends BaseCache {
    constructor(client, maxCacheSize = 100) {
        super(maxCacheSize * 100);
        this.client = client;
    }

    async fetch(...ids) {
        let member = await this.client.API.get(`/guilds/${ids[0]}/members/${ids[1]}`);
        if (!member) return null;

        // Save the member to the cache
        this.set(ids[1], member.id, member);

        return member;
    }

}