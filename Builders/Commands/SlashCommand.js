/*
data: new SlashCommand()
    .setName('ping')
    .setDescription('Replies with pong')
    .setOptions(

        new SubCommand()
            .setName('subcommand')
            .setDescription('A subcommand')
            .setOptions(
                new StringOption()
                    .setName('subcommand_input')
                    .setDescription('The input to echo back')
                    .setRequired(true)
            ),

        new StringOption()
            .setName('input')
            .setDescription('The input to echo back')
            .setRequired(true),

        new UserOption()
            .setName('target')
            .setDescription('The user to mention')
            .setRequired(true),

        new IntegerOption()
            .setName('amount')
            .setDescription('How many times to repeat the response')
            .setRequired(false)
    )
*/

const BaseCommand = require('./BaseCommand.js');

module.exports = class SlashCommand extends BaseCommand {
    constructor() {
        super();
    }

    toJSON() {
        let options = [];
        for (let option of this.options) {
            if (typeof option.toJSON !== 'function') {
                throw new Error('Invalid option - Missing toJSON() method');
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