let _client = null;

module.exports = class GuildRoleHelper extends Array {
    constructor(guild, client) {

        if (typeof guild !== 'object') throw new Error('Invalid guild - Must be a guild object');
        if (typeof client !== 'object') throw new Error('Invalid client - Must be a client object');

        super( ...guild.roles );
        this.guildID = guild.id;
        _client = client;
    }

    async delete(roleID) {
        // send DELETE request to /guilds/{guild.id}/roles/{role.id}
        await _client.API.emit('DELETE', `/guilds/${this.guildID}/roles/${roleID}`);
    }

    async create(role) {
        if (typeof role !== 'object') throw new Error('Invalid role - Must be a role object');

        /*
        Required parameters:
        name: string
        permissions?: array | integer
        color?: integer
        hoist?: boolean
        mentionable?: boolean
        */

    }

    async edit(roleID, options) {
        // todo
    }

    async get(roleID) {
        return await client.roles.get(this.guildID, roleID);
    }

    async has(roleID) {
        return await client.roles.has(this.guildID, roleID);
    }
}