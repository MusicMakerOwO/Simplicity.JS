const BaseCommand = require('./BaseCommand.js');

module.exports = class SubCommandGroup extends BaseCommand {
    constructor() {
        super();
        this.type = 2;
    }

    toJSON() {
        const options = this.options.map(o => typeof o.toJSON === 'function' ? o.toJSON() : o);

        if (options.length > 25) {
            throw new Error('Invalid options - Must be less than 25 options');
        }

        if (options.some(o => o.type !== 1)) {
            throw new Error('Invalid options - Subcommand groups can only contain subcommands, use a subcommand instead!');
        }

        return {
            name: this.name,
            description: this.description,
            options: options
        };
    }

}