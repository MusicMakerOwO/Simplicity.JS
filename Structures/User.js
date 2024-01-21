let client = null;

module.exports = class User {
    constructor(data, _client) {
        client = _client;

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
        this.banner = data.banner;
        this.bannerColor = data.accentColor;

        this.verified = data.verified;
        this.bot = data.bot;
        this.system = data.system;
        this.flags = data.flags;

        this.email = data.email;
        this.premium_type = data.premium_type;
        this.public_flags = data.public_flags;
    }

    avatarURL(options = {}) {
        if (typeof options !== 'object') throw new Error('Options must be an object.');
        if (typeof options.size !== 'number') options.size = 1024;
        if (typeof options.dynamic !== 'boolean') options.dynamic = true;

        if (options.dynamic) {
            if (this.avatar.startsWith('a_')) {
                options.format = 'gif';
            }
        }

        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${options.format}?size=${options.size}`;
    }

    get tag() {
        return `${this.username}#${this.discriminator || '0000'}`;
    }


    get defaultAvatarURL() {
        return `https://cdn.discordapp.com/embed/avatars/${(this.id >> 22) % 6}.png`;
    }

    get mention() {
        return `<@${this.id}>`;
    }

    get createdAt() {
        return new Date(this.id / 4194304 + 1420070400000);
    }

    get displayAvatarURL() {
        return this.avatarURL();
    }

    async send(content) {
        let data = {};

        if (typeof content === 'string') {
            data.content = content;
        } else if (typeof content === 'object') {
            data = content;
        } else {
            throw new Error('Invalid message data - Must be a string or object');
        }

        data.ephemeral = data.ephemeral || false;

        if (data.embeds) {
            data.embeds = data.embeds.map(embed => {
                if (typeof embed.toJSON === 'function') {
                    return embed.toJSON();
                }
                return embed;
            });

            if (data.embeds.length > 10) {
                throw new Error('Embed limit exceeded - Max 10 embeds');
            }
        }

        if (data.components) {
            data.components = data.components.map(component => {
                if (typeof component.toJSON === 'function') {
                    return component.toJSON();
                }
                return component;
            });

            if (data.components.length > 5) {
                throw new Error('Component limit exceeded - Max 5 components');
            }
        }

        let channel = await client.API.emit('POST', `/user/@me/channels`, {
            recipient_id: this.id
        });
        if (!channel) throw new Error('Failed to create DM channel');

        await client.API.emit('POST', `/channels/${channel.id}/messages`, data);

        return channel;
    }


}