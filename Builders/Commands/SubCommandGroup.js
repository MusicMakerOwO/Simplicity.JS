const BaseCommand = require('./BaseCommand.js');

module.exports = class SubCommandGroup extends BaseCommand {
    constructor() {
        super();
        this.type = 2;
    }

    toJSON() {
        let options = [];
        for (let option of this.options) {
            if (typeof option.toJSON !== 'function') {
                throw new Error('Invalid option - Missing toJSON() method');
            }

            if (option.type === 2) {
                throw new Error('Invalid option - Subcommand groups cannot contain subcommand groups, only subcommands');
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