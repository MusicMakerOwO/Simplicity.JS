const BaseCommand = require('./BaseCommand.js');

module.exports = class SubCommand extends BaseCommand {
    constructor() {
        super();
        this.type = 1;
    }

    toJSON() {
        let options = [];
        for (let option of this.options) {
            if (typeof option.toJSON !== 'function') {
                throw new Error('Invalid option - Missing toJSON() method');
            }

            if (option.type === 1) {
                throw new Error('Invalid option - Subcommands cannot contain subcommands, put it in a SubCommandGroup instead');
            }

            if (option.type === 2) {
                throw new Error('Invalid option - Subcommands cannot contain subcommand groups');
            }
            
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