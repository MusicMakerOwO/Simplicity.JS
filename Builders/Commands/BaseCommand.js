module.exports = class BaseOption {
    constructor(type) {
        this.name = 'base';
        this.description = 'Base option';
        this.options = [];
    }

    setName(name) {
        if (typeof name !== 'string') throw new Error('Invalid option name - Must be a string');

        const nameRegex = /^[a-z0-9_-]+$/;
        if (!nameRegex.test(name)) {
            throw new Error('Invalid option name - Only lowercase letters, dashes, and underscores are allowed');
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

        // check if options has any subcommands
        let subCommands = options.filter(o => o.type === 1);
        for (let subCommand of subCommands) {
            if (subCommand.options.length > 25) throw new Error('Invalid options - Must be less than 25 options');
            if (subCommand.options.some(o => o.type === 1)) throw new Error('Invalid options - Subcommands cannot contain subcommands, use a subcommand group instead!');
            if (subCommand.options.some(o => o.type === 2)) throw new Error('Invalid options - Subcommands cannot contain subcommand groups, subcommands can only contain options!');
        }

        let subCommandGroups = options.filter(o => o.type === 2);
        for (let group of subCommandGroups) {
            if (group.options.length > 25) throw new Error('Invalid options - Must be less than 25 options');
            if (group.options.some(o => o.type !== 1)) throw new Error('Invalid options - Subcommand groups cannot contain subcommands, use a subcommand instead!');
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