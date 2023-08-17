const BaseCache = require('./BaseMultiCache');
const SizeLimitedMultiKeyMap = require('../../DataStructures/SizeLimitedMultiKeyMap.js');

module.exports = class MemberCache extends BaseCache {
    constructor(client, maxCacheSize = 100) {
        super(maxCacheSize * 100);
        this.client = client;
        this.cache = new SizeLimitedMultiKeyMap(maxCacheSize);
    }

    set (guildID, userID, data) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (typeof userID !== 'string') throw new TypeError('User ID must be a string');
        if (typeof data !== 'object') throw new TypeError('Data must be an object');

        this.cache.set(guildID, userID, data);
        return this;
    }

    async get (guildID, userID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (userID && typeof userID !== 'string') throw new TypeError('User ID must be a string');

        if (!userID) {
            let members = await this.client.API.getBulk(`/guilds/${guildID}/members`);
            for (const member of members) {
                this.set(guildID, member.user.id, member);
            }
            return members;
        }

        if (!this.cache.has(guildID, userID)) {
            let member = await this.client.API.get(`/guilds/${guildID}/members/${userID}`);
            this.set(guildID, userID, member);
            return member;
        }

        return this.cache.get(guildID, userID);
    }

    has (guildID, userID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (typeof userID !== 'string') throw new TypeError('User ID must be a string');

        return this.cache.has(guildID, userID);
    }

    delete (guildID, userID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        if (typeof userID !== 'string') throw new TypeError('User ID must be a string');

        return this.cache.delete(guildID, userID);
    }

    random (guildID) {
        if (typeof guildID !== 'string') throw new TypeError('Guild ID must be a string');
        let values = this.cache.getAny(guildID);
        return values[Math.floor(Math.random() * values.length)];
    }

    get [Symbol.iterator]() {
        return this.cache[Symbol.iterator];
    }

}