module.exports = class BaseOption {
    constructor() {
        this.name = 'base';
        this.description = 'Base option';
        this.required = false;
    }

    setName(name) {
        if (typeof name !== 'string') throw new Error('Invalid option name - Must be a string');

        const nameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!nameRegex.test(name)) {
            throw new Error('Invalid option name - Only alphanumeric characters, dashes, and underscores are allowed');
        }

        if (name.length < 1 || name.length > 32) {
            throw new Error('Invalid option name - Must be between 1 and 32 characters in length');
        }

        this.name = name;
        return this;
    }

    setDescription(description) {
        if (typeof description !== 'string') throw new Error('Invalid option description - Must be a string');

        if (description.length > 100) {
            throw new Error('Invalid option description - Must be less than 100 characters in length');
        }

        this.description = description;
        return this;
    }

    setRequired(required) {
        this.required = Boolean(required);
        return this;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            required: this.required
        };
    }

    build() {
        return this.toJSON();
    }

}