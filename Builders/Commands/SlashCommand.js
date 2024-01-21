
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
const closestMatch = require('../../Utils/ClosestMatch.js');
const logs = require('../../Utils/Logs.js');
//const lang = require('../../Constants/language.js');
module.exports = class SlashCommand extends BaseCommand {
    constructor() {
        super();
        this.dmPermission = false;
        this.defaultPermission = 0;
        this.descriptionLocalizations = {};
        this.nsfw = false;
    }

    static isValid(command) {
        if (command instanceof SlashCommand) return true;

        if (!BaseCommand.isValid(command)) return false;

        if (command.type !== 1) return false;
        if (typeof command.default_permission !== 'boolean') return false;
        if (typeof command.dm_permission !== 'boolean') return false;
        if (typeof command.nsfw !== 'boolean') return false;
        if (typeof command.description_localizations !== 'object') return false;

        return true;
    }
    
    setDmPermission(permission) {
        if (typeof permission !== 'boolean') throw new Error('Invalid DM permissions - Must be a boolean(True or False)');
        this.dmPermission = Boolean(permission);
        return this;
    }

    setDefaultPermission(...permissions) {
        if (permissions.length === 0) throw new Error('Invalid default permissions - Must be a permission or an array of permissions');
        permissions = permissions.flat(Infinity);
        let PermissionBitField = 0
        for (const permission of permissions) {
            if (typeof permission !== "string") throw new Error('Invalid default permissions - Must be a permission or an array of permissions');
            if (!Permission[permission]) {
                const closest = closestMatch(permission, Object.keys(Permission));
                logs.warn(`Invalid permission ${permission} - Did you mean ${closest}?`);
                PermissionBitField |= Permission[closest];
            } else {
                PermissionBitField |= Permission[permission];
            }
        }
        this.defaultPermission = PermissionBitField;
        return this;
    }

    setNsfw(nsfw) {
        if (typeof nsfw !== 'boolean') throw new Error('Invalid NSFW - Must be a boolean(True or False)');
        this.nsfw = Boolean(nsfw);
        return this;
    }

    setLanguage(...languages) {
        if (languages.length === 0) throw new Error('Invalid language - Must be a language or an array of languages');
        languages = languages.flat(Infinity);
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            if (typeof language === 'object') {
                for (const key in language) {
                    const closest = closestMatch(key, Object.keys(lang));
                    this.descriptionLocalizations[closest] = language[key];
                }
            } else if (typeof language === 'string') {
                this.descriptionLocalizations[language] = languages[i + 1];
                i++;
            } else {
                throw new Error('Invalid language - Must be a language or an array of languages');
            }
        }
        return this;
    }

    toJSON() {
        const options = this.options.map(o => typeof o.toJSON === 'function' ? o.toJSON() : o);

        // cannot mix options with subcommands or subcommand groups
        if (options.some(o => o.type === 1 || o.type === 2)) {
            if (options.some(o => o.type > 2)) {
                throw new Error('Invalid options - You cannot mix subcommands or subcommand groups with other options');
            }
        }
        
        return {
            name: this.name,
            description: this.description,
            options: options,
            default_permission: this.defaultPermission,
            type: 1,
            description_localizations: this.descriptionLocalizations,
            nsfw: this.nsfw,
            dm_permission: this.dmPermission
        };
    }
}