module.exports = class SelectMenuOption {
    constructor(data) {
        if (data && typeof data !== 'object') throw new TypeError(`SelectMenuOption data must be type of object, received ${typeof data}`)
        
        this.data = data || {
            label: '\u200b',
            value: Math.random().toString(36).substring(2, 15),
            description: null,
            emoji: null
        }

    }


    setLabel(label) {
        if (typeof label !== 'string') throw new TypeError(`SelectMenuOption label must be type of string, received ${typeof label}`)
        if (label.length > 100) throw new RangeError(`SelectMenuOption label can't be longer than 100 characters, received ${label.length}`)
        this.data.label = label;
        return this;
    }

    setName(name) {
        return this.setLabel(name);
    }


    setValue(value) {
        if (typeof value !== 'string') throw new TypeError(`SelectMenuOption value must be type of string, received ${typeof value}`)
        if (value.length > 100) throw new RangeError(`SelectMenuOption value can't be longer than 100 characters, received ${value.length}`)
        this.data.value = value;
        return this;
    }

    setDescription(description) {
        if (typeof description !== 'string') throw new TypeError(`SelectMenuOption description must be type of string, received ${typeof description}`)
        if (description.length > 100) throw new RangeError(`SelectMenuOption description can't be longer than 100 characters, received ${description.length}`)
        this.data.description = description;
        return this;
    }

    /*
    let dropDown = new SelectMenu()
        .setCustomId('select')
        .addOption(
            new SelectMenuOption()
                .setLabel('Rogue')
                .setValue('rogue')
                .setDescription('Sneak n stab')
                
                .setEmoji('<:rogue:625891304148303894>')
                .setEmnji({ name: 'rogue', id: '625891304148303894' })
                .setEmoji('625891304148303894')
                .setEmoji('⚔️')
        )
    */
    setEmoji(emoji) {
        if (typeof emoji === 'string') {
            let emojiRegex = /<(a)?:?(\w{2,32}):(\d{17,})>/;
            let emojiData = emojiRegex.exec(emoji);

            if (emojiData) {
                let ID = emojiData.pop();
                let name = emojiData.pop();

                this.data.emoji = { name: name, id: ID }
            } else {
                let IDRegex = /(\d{17,})/;
                let ID = IDRegex.exec(emoji);

                if (ID) {
                    this.data.emoji = { name: '__', id: ID.pop() }
                } else {
                    this.data.emoji = { name: emoji, id: null }
                }
            }

        } else if (typeof emoji === 'object') {
            if (typeof emoji.id !== 'string') throw new TypeError(`SelectMenuOption emoji id must be type of string, received ${typeof emoji.id}`)
            if (typeof emoji.name !== 'string') throw new TypeError(`SelectMenuOption emoji name must be type of string, received ${typeof emoji.name}`)

            this.data.emoji = { name: emoji.name, id: emoji.id }
        } else if (emoji === null || emoji === undefined) {
            this.data.emoji = null;
        }

        return this;
    }

    toJSON() {
        return this.data;
    }

    build() {
        return this.toJSON();
    }

}