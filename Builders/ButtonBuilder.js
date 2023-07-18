const styles = {
    primary: 1,
    secondary: 2,
    success: 3,
    danger: 4,
    link: 5,

    blue: 1,
    grey: 2,
    green: 3,
    red: 4,
    url: 5,

    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5
}

module.exports = class ButtonBuilder {
    constructor() {
        this.type = 2;
        this.style = 2;
        this.label = '\u200b';
        this.custom_id = 'null';
        this.disabled = false;
        this.url = "https://discord.com/";
        this.emoji = null;
    }

    setStyle(style) {
        if (!styles[style.toLowerCase()]) throw new Error('Invalid style, use one of the following: ' + Object.keys(styles).slice(0, 10).join(', '));
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
        this.custom_id = id;
        return this;
    }

    disable(disabled) {
        this.setDisabled(disabled);
        return this;
    }

    setDisabled(disabled) {
        if (typeof disabled !== 'boolean') throw new Error('Disabled must be a boolean (true/false) - Received: ' + typeof disabled);
        this.disabled = disabled;
        return this;
    }



    url(url) {
        this.setURL(url);
        return this;
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
                let emojiRegex = /<(a?):([\w\d]{2,32}):(\d{17,})>/;
                let IDRegex = /(\d{17,})/;

                if (emojiRegex.test(emoji)) {
                    let emojiData = emoji.match(emojiRegex)[0].split(':');
                    let ID = emojiData.pop();
                    let name = emojiData.pop();

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

    build() {
        return this.toJSON();
    }

}