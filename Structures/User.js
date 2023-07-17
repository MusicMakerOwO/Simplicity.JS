module.exports = class User {
    constructor(data) {
        /* 
        {
            "id": "80351110224678912",
            "username": "Nelly",
            "discriminator": "1337",
            "avatar": "8342729096ea3675442027381ff50dfe",
            "verified": true,
            "email": "nelly@discord.com",
            "flags": 64,
            "banner": "06c16474723fe537c283b8efa61a30c8",
            "accent_color": 16711680,
            "premium_type": 1,
            "public_flags": 64
        }
        */
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.verified = data.verified;
        this.email = data.email;
        this.flags = data.flags;
        this.banner = data.banner;
        this.banner_color = data.accent_color;
        this.premium_type = data.premium_type;
        this.public_flags = data.public_flags;
    }

    get tag() {
        return `${this.username}#${this.discriminator || '0000'}`;
    }

    getAvatarURL(options = {}) {
        this.avatarURL(options);
    }

    avatarURL(options = {}) {
        if (typeof options !== 'object') throw new Error('Options must be an object.');
        if (typeof options.format !== 'string') options.format = 'png';
        if (typeof options.size !== 'number') options.size = 1024;
        if (typeof options.dynamic !== 'boolean') options.dynamic = true;

        if (options.dynamic) {
            if (this.avatar.startsWith('a_')) {
                options.format = 'gif';
            }
        }

        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${options.format}?size=${options.size}`;
    }

    get defaultAvatarURL() {
        return `https://cdn.discordapp.com/embed/avatars/${(this.id >> 22) % 6}.png`;
    }


}