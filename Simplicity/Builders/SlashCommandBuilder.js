/*
data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong')
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel to send the message to'))
    .addChannelOption({
        name: 'channel',
        description: 'The channel to send the message to',
        required: true,
    })
    .toJSON()
*/
const CommandOptionType = require('../Constants/OptionType.js');

const ChannelOption = require('./CommandOptions/ChannelOption.js');
const RoleOption = require('./CommandOptions/RoleOption.js');
const UserOption = require('./CommandOptions/UserOption.js');
const StringOption = require('./CommandOptions/StringOption.js');
const IntegerOption = require('./CommandOptions/IntegerOption.js');
const BooleanOption = require('./CommandOptions/BooleanOption.js');
const MentionableOption = require('./CommandOptions/MentionableOption.js');
const NumberOption = require('./CommandOptions/NumberOption.js');

function validateName(name, type = 'Command name') {
    if (typeof name !== 'string') throw new TypeError(`${type} must be a string, received ${typeof name}`);
    if (name.length < 1) throw new RangeError(`${type} must be at least 1 characters, received ${name.length}`);
    if (name.length > 32) throw new RangeError(`${type} must be less than 32 characters, received ${name.length}`);
    if (!/^[-_a-z0-9]+$/i.test(name)) throw new TypeError(`${type} must only contain lowercase letters, numbers, dashes, and underscores`);
}

module.exports = class SlashCommandBuilder {
    constructor() {
        this.data = {
            name: null,
            description: null,
            options: [],
        };
    }

    setName(name) {
        this.data.name = name;
        return this;
    }

    setDescription(description) {
        this.data.description = description;
        return this;
    }

    addOption(option, type, builder) {
        switch (typeof option) {
            case 'function':
                // List all functions within the builder
                console.log(builder.prototype)
                console.log( Object.getOwnPropertyNames(builder) );
                break;
            case 'object':
                
                if (!option.name) throw new Error(`${type} option name is required`);
                validateName(option.name, `${type} option name`);

                option = {
                    name: option.name,
                    description: option.description || '\u200b',
                    type: CommandOptionType[ type.toUpperCase() ],
                    required: Boolean(option.required)
                };

                break;
            default:
                throw new TypeError(`${type} option must be a function or object, received ${typeof option}`);
        }

        this.data.options.push(option);
        return this;
    }


    addChannel(option) {
        return this.addChannelOption(option);
    }
    addChannelOption(option) {
        return this.addOption(option, 'channel', ChannelOption);
    }


    addRole(option) {
        return this.addRoleOption(option);
    }
    addRoleOption(option) {
        return this.addOption(option, 'role', RoleOption);
    }


    addUser(option) {
        return this.addUserOption(option);
    }
    addUserOption(option) {
        return this.addOption(option, 'user', UserOption);
    }

    
    addString(option) {
        return this.addStringOption(option);
    }
    addStringOption(option) {
        return this.addOption(option, 'string', StringOption);
    }


    addInteger(option) {
        return this.addIntegerOption(option);
    }
    addIntegerOption(option) {
        return this.addOption(option, 'integer', IntegerOption);
    }


    addBoolean(option) {
        return this.addBooleanOption(option);
    }
    addBooleanOption(option) {
        return this.addOption(option, 'boolean', BooleanOption);
    }


    addMentionable(option) {
        return this.addMentionableOption(option);
    }
    addMentionableOption(option) {
        return this.addOption(option, 'mentionable', MentionableOption);
    }


    addNumber(option) {
        return this.addNumberOption(option);
    }
    addNumberOption(option) {
        return this.addOption(option, 'number', NumberOption);
    }


    toJSON() {
        return this.data;
    }
}