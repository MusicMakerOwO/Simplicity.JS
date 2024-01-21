const ExtendedMap = require('../DataStructures/ExtendedMap.js');
const Member = require('../Structures/GuildData/Member.js');

let _client = null;
let _guild = null;

module.exports = class GuildMembers extends ExtendedMap {
    constructor(client, guild, members) {
        super();

        _client = client;
        _guild = guild;

        for (const member of members) {
            this.set(member.user.id, member);
        }
    }

    async get(userID, options = {}) {
        if (typeof userID !== 'string') throw new TypeError('User ID must be a string');
    }

}