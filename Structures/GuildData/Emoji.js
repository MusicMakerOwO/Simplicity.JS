module.exports = class Emoji {
    constructor(data) {
        this.id = data.id;
        this.guild_id = data.guild_id;
        this.name = data.name;
        this.require_colons = data.require_colons;
        this.managed = data.managed;
        this.animated = data.animated;
        this.available = data.available;
        this.user = data.user;
    }
}