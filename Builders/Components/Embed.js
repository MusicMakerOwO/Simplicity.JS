const ClosestMatch = require("../../Utils/ClosestMatch.js");
const Logs = require("../../Utils/Logs.js");

const colors = {
    pureblue: 0x0000ff,
    purered: 0xff0000,
    puregreen: 0x00ff00,
    white: 0xffffff,
    black: 0x000000,
    aqua: 0x1abc9c,
    green: 0x57f287,
    blue: 0x3498db,
    yellow: 0xfee75c,
    purple: 0x9b59b6,
    luminousvividpink: 0xe91e63,
    fuchsia: 0xeb459e,
    gold: 0xf1c40f,
    orange: 0xe67e22,
    red: 0xed4245,
    grey: 0x95a5a6,
    navy: 0x34495e,
    darkaqua: 0x11806a,
    darkgreen: 0x1f8b4c,
    darkblue: 0x206694,
    darkpurple: 0x71368a,
    darkvividpink: 0xad1457,
    darkgold: 0xc27c0e,
    darkorange: 0xa84300,
    darkred: 0x992d22,
    darkgrey: 0x979c9f,
    darkergrey: 0x7f8c8d,
    lightgrey: 0xbcc0c0,
    darknavy: 0x2c3e50,
    blurple: 0x5865f2,
    greyple: 0x99aab5,
    darkbutnotblack: 0x2c2f33,
    notquiteblack: 0x23272a,
    
    random: Math.floor(Math.random() * 0xffffff) + 1
}


function parseURL(url, type) {
    if (typeof url !== 'string') throw new TypeError(`${type} URL must be a string`);
    if (!url.startsWith('https')) throw new TypeError(`${type} URL must only be an HTTPS URL`);
}

function parseDimensions(width = 0, height = 0, type) {
    if (typeof width !== 'number') throw new TypeError(`${type} width must be a number`);
    if (typeof height !== 'number') throw new TypeError(`${type} height must be a number`);
    if (width < 0 || width > 4096) throw new RangeError(`${type} width must be between 0 and 4096`);
    if (height < 0 || height > 4096) throw new RangeError(`${type} height must be between 0 and 4096`);
}


module.exports = class EmbedBuilder {
    constructor() {
        this.title = null;
        this.type = 'rich',
        this.description = '\u200b'; // '\u200b' is a zero-width space
        this.url = null;
        this.timestamp = null;
        this.color = Math.floor(Math.random() * 0xffffff);
        this.footer = null;
        this.image = null;
        this.thumbnail = null;
        this.video = null;
        this.provider = null;
        this.author = null;
        this.fields = []

        this.maxFieldError = false;
    }

    setTitle(title) {
        if (typeof title !== 'string') throw new TypeError('Title must be a string');
        if (title.length > 256) throw new RangeError('Title must be less than 256 characters');
        this.title = title;
        return this;
    }

    setDescription(description) {
        if (typeof description !== 'string') throw new TypeError('Description must be a string');
        if (description.length > 4096) throw new RangeError('Description must be less than 2048 characters');
        this.description = description;
        return this;
    }

    setURL(url) {
        if (typeof url !== 'string') throw new TypeError('URL must be a string');
        this.url = url;
        return this;
    }

    setTimestamp(timestamp) {
        if (!timestamp) timestamp = new Date();

        switch (typeof timestamp) {
            case 'string':
            case 'number':
                timestamp = new Date(timestamp);
            case 'object':
                if (!(timestamp instanceof Date)) throw new TypeError('Timestamp must be a valid Date object');
                break;
            default:
                throw new TypeError('Timestamp must be a Date object, number, or string - Received ' + typeof timestamp);
        }

        // convert to ISO8601 timestamp
        timestamp = timestamp.toISOString();

        this.timestamp = timestamp;
        return this;
    }

    setColor(color) {
        switch (typeof color) {
            case 'string':
                const numberRegex = /^\d+$/;
                if (color.startsWith('#')) {
                    color = parseInt(color.replace('#', ''), 16);
                } else if (color.startsWith('0x')) {
                    color = parseInt(color.replace('0x', ''), 16);
                } else if (color.startsWith('rgb')) {
                    color = color.replace('rgb(', '').replace(')', '').split(',').map(c => parseInt(c.trim()));
                    color = (color[0] << 16) + (color[1] << 8) + color[2];
                } else if (numberRegex.test(color)) {
                    color = parseInt(color);
                } else {
                    color = colors[color.toLowerCase()];
                    if (!color) {
                        const closestMatch = ClosestMatch(color, Object.keys(colors));
                        Logs.warn(`Unknown color "${color}" - Closest match: "${closestMatch}"`);
                        color = colors[closestMatch];
                    }
                }
                break;
            case 'number':
                if (color < 0 || color > 0xffffff) throw new RangeError('Color must be a valid color code');
                break;
            case 'array':
                if (color.length !== 3) throw new RangeError('Color array must be 3 elements long');
                if (color.some(c => c < 0 || c > 255)) throw new RangeError('Color array elements must be between 0 and 255');
                color = (color[0] << 16) + (color[1] << 8) + color[2];
                break;
            default:
                throw new TypeError('Color must be a string, number, or array - Received ' + typeof color);
        }

        this.color = color;
        return this;
    }

    setFooter(data) {
        switch (typeof data) {
            case 'string':
                data = {
                    text: data
                }
                break;
            case 'object':
                if (typeof data.text !== 'string') throw new TypeError('Footer text must be a string');
                if (data.text > 256) throw new RangeError('Footer text must be less than 256 characters');

                if (data.iconUrl) {
                    parseURL(data.iconUrl, 'Footer icon');
                }

                if (data.proxyIconUrl) {
                    parseURL(data.proxyIconUrl, 'Footer proxy icon');
                }

                break;
            default:
                throw new TypeError('Footer must be a string or object - Received ' + typeof data);
        }

        this.footer = data;
        return this;
    }

    setImage(image) {
        switch (typeof image) {
            case 'string':
                image = {
                    url: image
                }
                break;
            case 'object':

                if (image.url) {
                    parseURL(image.url, 'Image URL');
                }
                
                if (image.proxyUrl) {
                    parseURL(image.proxyUrl, 'Image proxy URL');
                }

                if (!image.url && !image.proxyUrl) throw new TypeError('Image must have a URL or proxy URL');
                
                if (image.height || image.width) {
                    parseDimensions(image.width, image.height, 'Image');
                }

                break;
            default:
                throw new TypeError('Image must be a string or object - Received ' + typeof image);
        }

        this.image = image;
        return this;
    }

    setThumbnail(thumbnail) {
        switch (typeof thumbnail) {
            case 'string':
                thumbnail = {
                    url: thumbnail
                }
                break;
            case 'object':

                if (thumbnail.url) {
                    parseURL(thumbnail.url, 'Thumbnail URL');
                }

                if (thumbnail.proxyUrl) {
                    parseURL(thumbnail.proxyUrl, 'Thumbnail proxy URL');
                }

                if (!thumbnail.url && !thumbnail.proxyUrl) throw new TypeError('Thumbnail must have a URL or proxy URL');

                if (thumbnail.height || thumbnail.width) {
                    parseDimensions(thumbnail.width, thumbnail.height, 'Thumbnail');
                }

                break;
            default:
                throw new TypeError('Thumbnail must be a string or object - Received ' + typeof thumbnail);
        }

        this.thumbnail = thumbnail;
        return this;
    }

    setVideo(video) {
        switch (typeof video) {
            case 'string':
                video = {
                    url: video
                }
                break;
            case 'object':

                if (video.url) {
                    parseURL(video.url, 'Video URL');
                }

                if (video.proxyUrl) {
                    parseURL(video.proxyUrl, 'Video proxy URL');
                }

                if (!video.url && !video.proxyUrl) throw new TypeError('Video must have a URL or proxy URL');

                if (video.height || video.width) {
                    parseDimensions(video.width, video.height, 'Video');
                }

                break;
            default:
                throw new TypeError('Video must be a string or object - Received ' + typeof video);
        }

        this.video = video;
        return this;
    }

    setProvider(provider) {
        switch (typeof provider) {
            case 'string':
                provider = {
                    name: provider
                }
                break;
            case 'object':
                if (typeof provider.name !== 'string') throw new TypeError('Provider name must be a string');
                if (provider.name > 256) throw new RangeError('Provider name must be less than 256 characters');

                if (provider.url) {
                    parseURL(provider.url, 'Provider URL');
                }

                break;
            default:
                throw new TypeError('Provider must be a string or object - Received ' + typeof provider);
        }

        this.provider = provider;
        return this;
    }

    setAuthor(author) {
        switch (typeof author) {
            case 'string':
                author = {
                    name: author
                }
                break;
            case 'object':
                
                if (typeof author.name !== 'string') throw new TypeError('Author name must be a string');
                if (author.name > 256) throw new RangeError('Author name must be less than 256 characters');

                if (author.url) {
                    parseURL(author.url, 'Author URL');
                }

                if (author.iconUrl) {
                    parseURL(author.iconUrl, 'Author icon URL');
                }

                if (author.proxyIconUrl) {
                    parseURL(author.proxyIconUrl, 'Author proxy icon URL');
                }

                break;
            default:
                throw new TypeError('Author must be a string or object - Received ' + typeof author);
        }

        this.author = author;
        return this;

    }

    /*
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        ...
    )

    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    ...

    .addFields([
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        ...
    ])

    .addFields("Regular field title", "Some value here", true)
    .addFields("Regular field title", "Some value here")
    */

    addField (...fields) {
        return this.addFields(...fields);
    }

    setFields (...fields) {
        this.fields = [];
        return this.addFields(...fields);
    }

    setField (...fields) {
        return this.setFields(...fields);
    }

    addFields(...fields) {

        if (fields.length === 0) return this;

        const fieldObject = {
            name: '\u200b',
            value: '\u200b',
            inline: false
        }

        // If the first argument is a string, assume it's a title and value
        if (typeof fields[0] === 'string') {
            if (typeof fields[1] !== 'string') throw new TypeError('Field value must be a string');
            if (fields[0] > 256) throw new RangeError('Field name must be less than 256 characters');
            if (fields[1] > 1024) throw new RangeError('Field value must be less than 1024 characters');
            if (typeof fields[2] !== 'boolean') throw new TypeError('Field inline must be a boolean (true/false)');

            fieldObject.name = fields[0] || '\u200b';
            fieldObject.value = fields[1] || '\u200b';
            fieldObject.inline = fields[2] || false;

            if (this.fields.length + 1 > 25) {
                if (!this.maxFieldError) {
                    console.error( new Error('Embeds cannot have more than 25 fields').stack );
                    this.maxFieldError = true;
                }
                return this;
            }

            this.fields.push(fieldObject);
            return this;
        }

        for (const field of fields) {
            fieldObject = {
                name: '\u200b',
                value: '\u200b',
                inline: false
            }

            if (Array.isArray(field)) {
                this.addFields(...field);
                continue;
            }
            switch (typeof field) {
                case 'object':
                    if (field.name) {
                        if (typeof field.name !== 'string') throw new TypeError('Field name must be a string');
                        if (field.name > 256) throw new RangeError('Field name must be less than 256 characters');
                    }

                    if (field.value) {
                        if (typeof field.value !== 'string') throw new TypeError('Field value must be a string');
                        if (field.value > 1024) throw new RangeError('Field value must be less than 1024 characters');
                    }

                    if (field.inline) {
                        if (typeof field.inline !== 'boolean') throw new TypeError('Field inline must be a boolean (true/false)');
                    }

                    break;
                default:
                    throw new TypeError('Field must be an object - Received ' + typeof field);
            }
            
            fieldObject.name = field.name || '\u200b';
            fieldObject.value = field.value || '\u200b';
            fieldObject.inline = field.inline || false;

            if (this.fields.length + 1 > 25) {
                if (!this.maxFieldError) {
                    console.error( new Error('Embeds cannot have more than 25 fields').stack );
                    this.maxFieldError = true;
                }
                return this;
            }
            
            this.fields.push(fieldObject);
        }

        return this;
    }

    toJSON() {
        return {
            title: this.title,
            type: this.type,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp,
            color: this.color,
            footer: this.footer,
            image: this.image,
            thumbnail: this.thumbnail,
            video: this.video,
            provider: this.provider,
        }
    }

}