const BaseOption = require('./BaseOption');

module.exports = class StringOption extends BaseOption {
    constructor() {
        super();
        this.type = 3;
        this.choices = [];
        this.max_length = 6000;
        this.min_length = 1;
        this.autocomplete = false;
    }

    setMinLength(length) {
        if (typeof length !== 'number') {
            throw new Error('Invalid length - Must be a number');
        }

        if (length < 1 || length > 6000) {
            throw new Error('Invalid length - Must be between 1 and 6000');
        }

        this.min_length = length;
        return this;
    }

    setMaxLength(length) {
        if (typeof length !== 'number') {
            throw new Error('Invalid length - Must be a number');
        }

        if (length < 1 || length > 6000) {
            throw new Error('Invalid length - Must be between 1 and 6000');
        }

        this.max_length = length;
        return this;
    }

    setAutocomplete(autocomplete) {
        this.autocomplete = Boolean(autocomplete);
        return this;
    }

    /*
    .setChoices(
        { name: 'Choice 1', value: 'value1' },
        { name: 'Choice 2', value: 'value2' },
        ...
    )

    .setChoices([
        { name: 'Choice 1', value: 'value1' },
        { name: 'Choice 2', value: 'value2' },
        ...
    ])

    .setChoices(
        new Choice('Choice 1', 'value1'),
        new Choice('Choice 2', 'value2'),
        ...
    )
    */
    setChoices(...choices) {
        for (let choice of choices) {
            if (Array.isArray(choice)) {
                return this.setChoices(choices);
            }

            if (this.choices.length >= 25) {
                throw new Error('Invalid choice object - Cannot have more than 25 choices');
            }

            if (typeof choice !== 'object') {
                throw new Error('Invalid choice object - Must be an instance of StringChoice or an object');
            } else {
                if (!choice.name) {
                    throw new Error('Invalid choice object - Must have name property');
                }

                if (!choice.value) choice.value = choice.name.replace(/ +/g, '_');


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
            max_length: this.max_length,
            min_length: this.min_length,
            autocomplete: this.autocomplete
        }
    }

    build() {
        return this.toJSON();
    }
}