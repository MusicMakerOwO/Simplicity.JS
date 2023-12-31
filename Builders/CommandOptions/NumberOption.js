const OptionType = require('../../Constants/OptionType.js');

module.exports = class NumberOption {
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

    setMaxValue(maxValue) {
        this.data.maxValue = maxValue;
        return this;
    }

    setMinValue(minValue) {
        this.data.minValue = minValue;
        return this;
    }

    toJSON() {
        return {
            ...this.data,
            type: OptionType.NUMBER,
        };
    }
}