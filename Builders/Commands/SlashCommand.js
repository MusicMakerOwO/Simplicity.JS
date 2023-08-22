
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
const Permission = require('../../Constants/Permission.js');
const closestMatch = require('../../Utils/closestMatch.js');
const logs = require('../../Utils/logs.js');
const lang = require('../../Constant/language.js');
module.exports = class SlashCommand extends BaseCommand {
    constructor() {
        super();
        this.dmPermissions = false;
        this.defaultPermission = 0;
        this.descriptionLocalizations = {};
        this.nsfw = false;
    }
    
    setDmPermissions(permission) {
        if (typeof permission !== 'boolean') throw new Error('Invalid DM permissions - Must be a boolean(True or False)');
        this.dmPermissions = permission;
        return this;
    }

    setDefaultPermission(...permissions) {
        if (permissions.length === 0) throw new Error('Invalid default permissions - Must be a permission or an array of permissions');
        const PermissionBitField = 0
        for (let permission of permissions) {
            if (typeof permission !== "string") throw new Error('Invalid default permissions - Must be a permission or an array of permissions');
            if (!Permission[permission]) {
                let closest = closestMatch(permission, Object.keys(Permission));
                logs.warn(`Invalid default permission ${permission} - Did you mean ${closest}?`);
                PermissionBitField = PermissionBitField | Permission[closest];
            } else {
                PermissionBitField = PermissionBitField | Permission[permission];
            }
        }
        this.defaultPermission = PermissionBitField;
        return this;
    }

    setNsfw(nsfw) {
        if (typeof nsfw !== 'boolean') throw new Error('Invalid NSFW - Must be a boolean(True or False)');
        this.nsfw = nsfw;
        return this;
    }

    setLanguage(...languages) {
        if (languages.length === 0) throw new Error('Invalid language - Must be a language or an array of languages');
        for (let language of languages) {
            if (typeof language === 'object') {
                for (let key in language) {
                    this.descriptionLocalizations[closestMatch(key, Object.keys(lang))] = languages[key];
                }
            } else if (typeof language === 'string') {
                this.descriptionLocalizations[language] = languages[1];
            } else {
                throw new Error('Invalid language - Must be a language or an array of languages');
            }
        }
        return this;
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