const BaseOption = require('./BaseOption.js');

module.exports = class IntegerOption extends BaseOption {
    constructor() {
        super();
        this.type = 4;
        this.max_value = (2 ** 53);
        this.min_value = -(2 ** 53);
        this.autocomplete = false;
        this.choices = [];
    }

    setMax(value) {
        return this.setMaxValue(value);
    }

    setMaxValue(value) {
        if (typeof value !== 'number') throw new Error('Max value must be a number');
        if (value > 2 ** 53) throw new Error('Max value must be less than 2^53 (9007199254740992)');
        if (value < -(2 ** 53)) throw new Error('Max value must be greater than -(2^53) (-9007199254740992)');
        this.max_value = value;
        return this;
    }

    setMin(value) {
        return this.setMinValue(value);
    }
    
    setMinValue(value) {
        if (typeof value !== 'number') throw new Error('Min value must be a number');
        if (value > 2 ** 53) throw new Error('Min value must be less than 2^53 (9007199254740992)');
        if (value < -(2 ** 53)) throw new Error('Min value must be greater than -(2^53) (-9007199254740992)');
        this.min_value = value;
        return this;
    }

    setAutocomplete(value) {
        this.autocomplete = Boolean(value);
    }

    setChoices(...choices) {
        for (let choice of choices) {
            if (Array.isArray(choice)) {
                return this.setChoices(choice);
            }

            if (this.choices.length >= 25) {
                throw new Error('Invalid choice object - Cannot have more than 25 choices');
            }

            if (typeof choice !== 'object') {
                throw new Error('Invalid choice object - Must be an instance of StringChoice or an object');
            } else {
                if (!choice.name || !choice.value) {
                    throw new Error('Invalid choice object - Must have name and value properties');
                }

                if (typeof choice.name !== 'string' || typeof choice.value !== 'string') {
                    throw new Error('Invalid choice object - Name and value properties must be strings');
                }

                if (choice.name.length > 100 || choice.value.length > 100) {
                    throw new Error('Invalid choice object - Name and value properties must be less than 100 characters');
                }

                if (choice.name.length < 1 || choice.value.length < 1) {
                    throw new Error('Invalid choice object - Name and value properties must be at least 1 character');
                }

                if (this.choices.find(c => c.value === choice.value)) {
                    throw new Error('Invalid choice object - Cannot have duplicate values');
                }

                this.choices.push(choice);
            }
        }

        return this;
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
            choices: this.choices,
            min_value: this.min_value,
            max_value: this.max_value,
            autocomplete: this.autocomplete
        };
    }

    build() {
        return this.toJSON();
    }
}