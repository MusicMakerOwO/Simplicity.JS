module.exports = class BaseCommand {
    constructor(type) {
        this.name = 'my-command';
        this.description = 'It does a thing, pretty cool';
        this.options = [];
    }

    static isValid(command = {}) {
        if (command instanceof BaseCommand) return true;

        if (typeof command.name !== 'string') return false;
        if (typeof command.description !== 'string') return false;
        if (!Array.isArray(command.options)) return false;

        return true;
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
        const options = this.options.map(o => typeof o.toJSON === 'function' ? o.toJSON() : o);

        const subCommands = options.filter(o => o.type === 1);
        for (let i = 0; i < subCommands.length; i++) {
            if (subCommands[i].options.length > 25) throw new Error('Invalid options - Must be less than 25 options');
            if (subCommands[i].options.some(o => o.type === 1)) throw new Error('Invalid options - Subcommands cannot contain subcommands, use a subcommand group instead!');
            if (subCommands[i].options.some(o => o.type === 2)) throw new Error('Invalid options - Subcommands cannot contain subcommand groups, subcommands can only contain options!');
        }

        const subCommandGroups = options.filter(o => o.type === 2);
        for (let i = 0; i < subCommandGroups.length; i++) {
            if (subCommandGroups[i].options.length > 25) throw new Error('Invalid options - Must be less than 25 options');
            if (subCommandGroups[i].options.some(o => o.type !== 1)) throw new Error('Invalid options - Subcommand groups cannot contain subcommands, use a subcommand instead!');
        }

        return {
            name: this.name,
            description: this.description,
            options: options
        };

    }
}