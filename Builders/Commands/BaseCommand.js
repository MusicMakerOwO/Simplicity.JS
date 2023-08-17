module.exports = class BaseCommand {
    constructor() {
        this.name = 'base';
        this.description = 'Base option';
        this.options = [];
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

    setOptions(...options) {
        if (options.length > 25) throw new Error('Invalid options - Must be less than 25 options');

        this.options = options;
        return this;
    }

    toJSON() {
        let options = [];

        for (const option of this.options) {
            if (typeof option.toJSON !== 'function') throw new Error('Invalid option - Must be a valid option');
            options.push(option.toJSON());
        }

        return {
            name: this.name,
            description: this.description,
            options: options
        };

    }

    build() {
        return this.toJSON();
    }

}