module.exports = class Role {
    constructor(data) {
        this.id = data.id;
        this.guild_id = data.guild_id;
        this.name = data.name;
        this.color = data.color;
        this.hoist = data.hoist;
        this.position = data.position;
        this.permissions = data.permissions;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.tags = data.tags;
    }
}