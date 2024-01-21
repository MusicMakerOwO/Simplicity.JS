const styles = {
    primary: 1,
    secondary: 2,
    success: 3,
    danger: 4,
    link: 5,

    blue: 1,
    grey: 2,
    gray: 2,
    green: 3,
    red: 4,
    url: 5,

    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5
}

const ClosestMatch = require('../../Utils/ClosestMatch');
const Log = require('../../Utils/Logs.js');

module.exports = class ButtonBuilder {
    constructor() {
        this.type = 2;
        this.style = 2;
        this.label = '\u200b';
        this.custom_id = Math.random().toString(36).substring(2, 15);
        this.disabled = false;
        this.url = "https://discord.com/";
        this.emoji = null;
    }

    setStyle(style = 'gray') {
        if (typeof style !== 'string') throw new Error('Style must be a string - Received: ' + typeof style);

        if (!styles[style.toLowerCase()]) {
            const closest = ClosestMatch(style.toLowerCase(), Object.keys(styles));
            Log.warn(`Invalid button style "${style}" - Using closest match: "${closest}"`);
            style = closest;
        }

        this.style = styles[style.toLowerCase()];
        return this;
    }
    
    setColor(color) {
        this.setStyle(color);
        return this;
    }

    setLabel(label) {
        if (typeof label !== 'string') throw new Error('Label must be a string - Received: ' + typeof label);
        if (label.length > 80) throw new Error('Label must be under 80 characters');
        this.label = label || '\u200b';
        return this;
    }

    setID(id) {
        this.setCustomID(id);
        return this;
    }

    setCustomID(id) {
        if (typeof id !== 'string') throw new Error('Custom ID must be a string - Received: ' + typeof id);
        if (id.length > 100) throw new Error('Custom ID must be under 100 characters');
        if (/[\w\-_]{1,100}/.test(id) === false) throw new Error('Custom ID can only contain letters, numbers, underscores, and dashes');
        this.custom_id = id;
        return this;
    }

    disable(disabled) {
        return this.setDisabled(disabled);
    }

    setDisabled(disabled) {
        if (typeof disabled !== 'boolean') throw new Error('Disabled must be a boolean (true/false) - Received: ' + typeof disabled);
        this.disabled = disabled;
        return this;
    }



    url(url) {
        return this.setURL(url);
    }

    setURL(url) {
        if (typeof url !== 'string') throw new Error('URL must be a string - Received: ' + typeof url);
        this.url = url;
        return this;
    }



    emoji(emoji) {
        this.setEmoji(emoji);
        return this;
    }

    setEmoji(emoji) {
        switch (typeof emoji) {
            case 'string':
                const emojiRegex = /<(a?):([\w\d]{2,32}):(\d{17,})>/;
                const IDRegex = /(\d{17,})/;

                if (emojiRegex.test(emoji)) {
                    const emojiData = emoji.match(emojiRegex)[0].split(':');
                    const ID = emojiData.pop();
                    const name = emojiData.pop();

                    this.emoji = {
                        id: ID,
                        name: name
                    } 
                } else if (IDRegex.test(emoji)) {
                    this.emoji = {
                        id: emoji,
                        name: "null"
                    }
                } else {
                    this.emoji = {
                        name: emoji,
                        id: "null"
                    }
                }

                break;
            case 'object':
                if (!emoji.id) throw new Error('Emoji object must have an ID');
                if (!emoji.name) throw new Error('Emoji object must have a name');

                this.emoji = {
                    id: emoji.id,
                    name: emoji.name
                }
                break;
            default:
                throw new Error('Emoji must be a string or an object - Received: ' + typeof emoji);
        }
        return this;
    }



    toJSON() {
        if (this.style === 5) {
            return {
                type: this.type,
                style: this.style,
                label: this.label,
                url: this.url,
                disabled: this.disabled
            }
        } else {
            return {
                type: this.type,
                style: this.style,
                label: this.label,
                custom_id: this.custom_id,
                disabled: this.disabled
            }
        }
    }

}