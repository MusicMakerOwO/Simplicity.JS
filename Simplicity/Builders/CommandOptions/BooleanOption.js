const OptionType = require('../../Constants/OptionType.js');

module.exports = class BooleanOption {
    constructor() {
        this.data = {
            name: null,
            description: null,
            required: false,
        };
    }

    setName(name) {
        this.data.name = name;
        return this;
    }

    setDescription(description) {
        this.data.description = description || '\u200b';
        return this;
    }

    setRequired(required = true) {
        this.data.required = Boolean(required);
        return this;
    }

    toJSON() {
        return {
            ...this.data,
            type: OptionType.BOOLEAN,
        };
    }
}