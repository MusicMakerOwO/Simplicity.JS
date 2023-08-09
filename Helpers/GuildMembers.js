const { SizeLimitedMap } = require("../DataStructures/SizeLimitedMap.js");

module.exports = class GuildMembers {
    constructor(client, guild, members) {
        this.client = client;
        this.guild = guild;
        this.cache = members;
    }

    async get(userID) {
        if (typeof userID !== 'string') throw new TypeError('User ID must be a string');

        let member = this.cache.find(member => member.user.id === userID);
        if (!member) {
            member = await this.client.members.get(this.guild.id, userID);
            if (!member) return null;
            
            this.cache.push(member);
        }
        return member;
    }

    async random() {
        let member = this.cache[Math.floor(Math.random() * this.cache.length)];
        return member;
    }

    async all() {
        return this.cache;
    }

    get [Symbol.iterator]() {
        return this.cache[Symbol.iterator];
    }

}