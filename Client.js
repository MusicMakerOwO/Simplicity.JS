const util = require('node:util');

const Events = require('./Events.js');
const OPCode = require('./Constants/OPCodes.js');
const ClosestMatch = require('./Utils/ClosestMatch.js');
const Logs = require('./Utils/Logs.js');
const FormatIntents = require('./Utils/FormatIntents.js');
const RegisterCommands = require('./Utils/RegisterCommands.js');
const ExtendedMap = require('./DataStructures/ExtendedMap.js');

const Guild = require('./Structures/Guild.js');
const Channel = require('./Structures/Channel.js');
const User = require('./Structures/User.js');
const Role = require('./Structures/GuildData/Role.js');
const Emoji = require('./Structures/GuildData/Emoji.js');
const Sticker = require('./Structures/GuildData/Sticker.js');
const Member = require('./Structures/GuildData/Member.js');

const Cache = require('./DataStructures/Cache.js');

const WSClient = require('./WSClient.js');

const SlashCommand = require('./Builders/Commands/SlashCommand.js');

module.exports = class Client extends Events {

    #token = null;

    constructor(options) {

        super();

        ValidateOptions(options);

        this.#token = options.token;
        this.clientID = options.clientID;
        this.intents = FormatIntents(options.intents);
        this.user = new Object(null);
        this._currentlyLoggedIn = false;

        this.API = new WSClient(this, this.#token);

        this.startTimestamp = null;

        this.guilds     = new Cache(this, '/guilds/{id}',   Guild,      { sizeLimit: options.sizeLimit } );
        this.channels   = new Cache(this, '/channels/{id}', Channel,    { sizeLimit: options.sizeLimit * 50 } );
        this.users      = new Cache(this, '/users/{id}',    User,       { sizeLimit: options.sizeLimit * 200 } );

        // Kind of the oddball, but it's used a lot so it's strong
        this.members    = new Cache(this, '/guilds/{id}/members/{id}',  Member,     { sizeLimit: options.sizeLimit } );

        // Strong: false - WeakRef
        // JS is allowed to clear from ram to save on memory usage
        // These items aren't used all that often so it's fine having to fetch occasionally
        this.emojis     = new Cache(this, '/guilds/{id}/emojis/{id}',   Emoji,      { sizeLimit: options.sizeLimit, strong: false } );
        this.stickers   = new Cache(this, '/guilds/{id}/stickers/{id}', Sticker,    { sizeLimit: options.sizeLimit, strong: false } );
        this.roles      = new Cache(this, '/guilds/{id}/roles/{id}',    Role,       { sizeLimit: options.sizeLimit, strong: false } );

        this.status = 'online';
        this.statusMessage = null;
        this.activities = [];

        this.commands = new ExtendedMap();
        this.buttons = new ExtendedMap();
        this.selectMenus = new ExtendedMap();
        this.modals = new ExtendedMap();
        this.contextMenus = new ExtendedMap();

        this.cache = new ExtendedMap();

        if (options.token) this.login(options.token);
    }

    async login(token = this.#token) {
        // if none is provided, use the one from the constructor
        if (!token) throw new Error('No token provided');
        if (typeof token !== 'string') throw new TypeError('Token must be a string, received ' + typeof token);

        if (this._currentlyLoggedIn) return new Error('Client is already logged in');
        this._currentlyLoggedIn = true;

        this.emit('debug', 'Logging in...');
        this.startTimestamp = Date.now();
        
        await this.API.login();

        this.emit('debug', 'Logged in');
    }


    get token() {
        if (!this.#token) return '[NO TOKEN]';
        return this.#token.split('.').map((t, i) => i > 1 ? t.replace(/./g, 'X') : t).join('.');
    }

    destroy() {
        this.API.destroy();
        this.emit('debug', 'Client destroyed');
    }

    disconnect() {
        return this.destroy();
    }

    /*
    await client.setStatus('online');
    await client.setStatus('idle');
    await client.setStatus('dnd');
    await client.setStatus('invisible');
    */

    async setStatus(status) {
        const statusList = [
            'online',
            'idle',
            'dnd',
            'invisible',
            'offline'
        ]

        if (typeof status !== 'string') throw new TypeError('Status must be a string, received ' + typeof status);
        status = status.toLowerCase();

        if (!statusList.includes(status)) {
            const closestMatch = ClosestMatch(status, statusList);
            Logs.warn(`Unknown status "${status}" - Closest match: "${closestMatch}"`);
            status = closestMatch;
        }

        this.status = status;

        this.API.websocket.send(JSON.stringify({
            op: OPCode.PRESENCE_UPDATE,
            d: {
                since: null,
                activities: this.activities,
                status: this.status,
                afk: false
            }
        }));
    }

    async setStatusMessage(message) {
        if (typeof message !== 'string') throw new TypeError('Status message must be a string, received ' + typeof message);
        this.statusMessage = message;
        this.activities = [{
            name: 'i just need literally any string here xD',
            state: message,
            type: 4
        }]

        this.API.websocket.send(JSON.stringify({
            op: OPCode.PRESENCE_UPDATE,
            d: {
                since: null,
                activities: this.activities,
                status: this.status,
                afk: false
            }
        }));
    }

    /*
    await client.setActivity('Streaming with Simplicity', 'https://twitch.tv/monstercat');
    await client.setActivity('Playing Rocket League');
    await client.setActivity('Listening to Spotify');
    await client.setActivity('Watching YouTube Together');
    */
    async setActivity(message, url) {
        /*
        0	Game	Playing {name}	"Playing Rocket League"
        1	Streaming	Streaming {details}	"Streaming Rocket League"
        2	Listening	Listening to {name}	"Listening to Spotify"
        3	Watching	Watching {name}	"Watching YouTube Together"
        4	Custom	{emoji} {name}	":smiley: I am cool"
        5	Competing	Competing in {name}	"Competing in Arena World Champions"
        */

        const typeList = {
            'playing': 0,
            'streaming': 1,
            'listening': 2,
            'watching': 3,
            'custom': 4,
            'competing': 5
        }

        if (typeof message !== 'string') throw new TypeError('Activity message must be a string, received ' + typeof message);
        if (url) {
            if (typeof url !== 'string') throw new TypeError('Activity url must be a string, received ' + typeof url);

            const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|twitch\.tv)/;
            if (!urlRegex.test(url)) throw new TypeError('Activity url must be a valid url : https://youtube.com or https://twitch.tv');
        }

        let activity = message.split(/ /g);
        let type = typeList[activity[0].toLowerCase()];
        if (type === undefined) {
            const closestMatch = ClosestMatch(activity[0], Object.keys(typeList));
            Logs.warn(`Unknown activity "${activity[0]}" - Closest match: "${closestMatch}"`);
            type = typeList[closestMatch];
        }

        activity = activity.slice(1).join(' ');

        if (type === 5) {
            // User: 'Competing in something'
            // Discord: 'Competing in in something'
            activity = activity.replace(/^in /, '');
        }

        this.activities = [{
            name: activity,
            type: type,
            url: url || null
        }];

        this.API.websocket.send(JSON.stringify({
            op: OPCode.PRESENCE_UPDATE,
            d: {
                since: null,
                activities: this.activities,
                status: this.status,
                afk: false
            }
        }));

    }


    async registerCommands(guildID) {
        if (!this.#token) throw new Error('Bot token it required to register commands, set it in client options!');

        if (this.commands.some(c => typeof c !== 'object')) throw new TypeError('Commands must only be objects or instance of the SlashCommand class');

        // We don't know how they choose to format their commands
        // So we need to loop through all properties until we find a valid command
        const commands = [];
        for (const command of this.commands.values) {

            if (typeof command === 'object' && SlashCommand.isValid(command)) {
                commands.push(command);
                continue;
            }

            for (const value of Object.values(command)) {
                if (value instanceof SlashCommand) {
                    commands.push(value.toJSON());
                    break;
                }
                
                if (typeof value === 'object' && SlashCommand.isValid(value)) {
                    commands.push(value);
                    break;
                }
            }

            throw new TypeError('Commands must only be objects or instance of the SlashCommand class\n' + util.inspect(command));
        }

        console.log(commands);

        return await RegisterCommands(commands, {
            token: this.#token,
            clientID: this.clientID,
            guildID: guildID
        });
    }

}


function ValidateOptions(options) {
    if (typeof options !== 'object') throw new TypeError('Client options must be an object, received ' + typeof options);

    if (options.token) {
        if (typeof options.token !== 'string') throw new TypeError('Client token must be a string, received ' + typeof options.token);
        
        const tokenRegex = /[\w\d]{24,}\.[\w\d]{6,}\.[\w\d\-_]{24,}/;
        if (!tokenRegex.test(options.token)) throw new TypeError('Client token must be a valid token');
        options.token = options.token.match(tokenRegex)[0];

        const base64ID = Buffer.from(options.token.split('.')[0], 'base64').toString();
        options.clientID = base64ID.match(/\d{17,}/)[0];
    }

    if (options.clientID) {
        if (typeof options.clientID !== 'string') throw new TypeError('Client ID must be a string, received ' + typeof options.clientID);
        const clientIDRegex = /[\d]{17,}/;
        if (!options.clientID.match(clientIDRegex)) throw new TypeError('Client ID must be a valid application ID');
    }

    if (!options.intents) {
        Logs.error(`No intents were provided, using defaults...`);
        options.intents = [ 'Guilds', 'GuildMessages', 'GuildEmojisAndStickers', 'Voice' ];

    } else {
        if (!Array.isArray(options.intents)) throw new TypeError('Client intents must be an array, received ' + typeof options.intents);
        if (options.intents.some(i => typeof i !== 'string')) throw new TypeError('Client intents must only contain strnigs');
    }

    options.sizeLimit = options.sizeLimit ?? 1000;

    if (options.sizeLimit) {
        if (typeof options.sizeLimit !== 'number') throw new TypeError('Client max cache size must be a number, received ' + typeof options.sizeLimit);
        if (options.sizeLimit < 0) throw new TypeError('Client max cache size must be a positive number');
        if (options.sizeLimit > 1_000) Logs.warn('Client max cache size is over 1,000 - Note that with more servers this can eat up a lot of memory. Use at your own risk.');
    }
}