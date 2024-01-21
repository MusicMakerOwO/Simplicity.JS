const BaseCommand = require('./BaseCommand.js');

module.exports = class SubCommand extends BaseCommand {
    constructor() {
        super();
        this.type = 1;
    }

    toJSON() {
        const options = this.options.map(o => typeof o.toJSON === 'function' ? o.toJSON() : o);

        if (options.length > 25) {
            throw new Error('Invalid options - Must be less than 25 options');
        }

        if (options.some(o => o.type === 1)) {
            throw new Error('Invalid options - Subcommands cannot contain subcommands, use a subcommand group instead!');
        }

        if (options.some(o => o.type === 2)) {
            throw new Error('Invalid options - Subcommands cannot contain subcommand groups, subcommands can only contain options!');
        }

        return {
            name: this.name,
            description: this.description,
            options: options
        };
    }

}