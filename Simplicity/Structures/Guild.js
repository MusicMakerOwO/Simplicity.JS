module.exports = class Guild {
    constructor(guild) {
        this.name = guild.name;
        this.id = guild.id;
        this.icon = guild.icon;
        this.ownerID = guild.ownerID;
        this.region = guild.region;
        this.memberCount = guild.memberCount;
        this.members = new Map();
        this.channels = new Map();
        this.roles = new Map();
        this.emojis = new Map();
        this._raw = guild;
    }

    get raw() {
        return this._raw;
    }

    get createdAt() {
        return new Date(this.id / 4194304 + 1420070400000);
    }

    get createdTimestamp() {
        return this.createdAt.getTime();
    }

    get deleted() {
        return this.client.guilds.cache.get(this.id) ? false : true;
    }

    get owner() {
        return this.members.get(this.ownerID);
    }

    get me() {
        return this.members.get(this.client.user.id);
    }

    get memberCount() {
        return this.members.size;
    }

    get available() {
        return this.deleted ? false : true;
    }

    get iconURL() {
        return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
    }

    get splashURL() {
        return this.splash ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png` : null;
    }

    get bannerURL() {
        return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png` : null;
    }

    get vanityURL() {
        return this.vanityURLCode ? `https://discord.gg/${this.vanityURLCode}` : null;
    }

}