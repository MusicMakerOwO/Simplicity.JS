const Utils = require('./Utils/UtilsLoader.js')();
const Events = require('./Events.js');
const Logs = require('./Utils/Logs.js');
const VoiceClient = require('./Voice/VoiceClient.js');
const Intents = require('./Constants/Intents.js');
const { ClosestMatch } = require('@musicmaker/simplicity');
const OPCode = require('./Constants/OPCodes.js');

// Object with all cache classes
let Cache = require('./Utils/CacheLoader.js')();

module.exports = class Client extends Events {
    constructor(options) {

        super();

        ValidateOptions(options);

        this._token = options.token;
        this.applicationID = options.applicationID ?? null;
        this.intents = Utils.FormatIntents(options.intents);
        this.user = new Object(null);
        this._currentlyLoggedIn = false;

        this.API_METHOD = options.API_METHOD || 'rest';
        this.API = new Object(null);

        this.startTimestamp = null;

        // bitwise AND : 0111 & 0100 = 0100
        this.voice = this.intents & Intents.Voice
            ? new VoiceClient(this)
            : null;

        this.guilds = new Cache.Guilds(this, options.maxCacheSize);
        this.channels = new Cache.Channels(this, options.maxCacheSize);
        this.users = new Cache.Users(this, options.maxCacheSize);
        this.roles = new Cache.Roles(this, options.maxCacheSize);
        this.emojis = new Cache.Emojis(this, options.maxCacheSize);
        this.stickers = new Cache.Stickers(this, options.maxCacheSize);
        this.members = new Cache.Members(this, options.maxCacheSize);

        this.status = 'online';
        this.statusMessage = null;
        this.activities = [];

        if (options.token) this.login(options.token);
    }

    async login(token) {
        // if none is provided, use the one from the constructor
        if (!token) token = this._token;
        if (!token) throw new Error('No token provided');

        this._token = token;

        if (this._currentlyLoggedIn) return new Error('Client is already logged in');
        this._currentlyLoggedIn = true;

        this.API = /(https?)/i.test(this.API_METHOD)
            ? new (require('./Clients/HTTPSClient.js'))(this)
            : new (require('./Clients/RESTClient.js'))(this);

        this.emit('debug', 'Logging in...');
        this.startTimestamp = Date.now();
        
        await this.API.login(token);

        this.emit('debug', 'Logged in');
    }


    censorToken() {
        if (!this._token) return '[NO TOKEN]';
        return this._token.split('.').map((t, i) => i > 0 ? t.replace(/./g, 'X') : t).join('.');
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
            let closestMatch = ClosestMatch(status, statusList);
            Logs.warn(`Unknown status "${status}" - Closest match: "${closestMatch}"`);
            status = closestMatch;
        }

        this.status = status;

        await this.API.websocket.send(JSON.stringify({
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
    await client.setStatusMessage('Playing', 'with Simplicity');
    await client.setStatusMessage('Listening', 'to Simplicity');
    await client.setStatusMessage('Watching', 'Simplicity');
    await client.setStatusMessage('Streaming', 'Simplicity', 'https://twitch.tv/simplicity');
    */
    async setStatusMessage(type, message, url) {
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

        if (typeof type !== 'string') throw new TypeError('Status type must be a string, received ' + typeof type);
        type = type.toLowerCase();

        if (typeof message !== 'string') throw new TypeError('Status message must be a string, received ' + typeof message);
        if (url && typeof url !== 'string') throw new TypeError('Status URL must be a string, received ' + typeof url);

        if (typeof typeList[type] !== 'number') {
            let closestMatch = ClosestMatch(type, Object.keys(typeList));
            Logs.warn(`Unknown status type "${type}" - Closest match: "${closestMatch}"`);
            type = closestMatch;
        }

        if (type === 'streaming') {
            if (!url) throw new Error('Streaming status must have a URL');
            if (!['youtube', 'twitch'].includes(url.split('.')[1])) throw new Error('Streaming URL must be from YouTube or Twitch');
            if (!url.startsWith('https://')) url = 'https://' + url;
        }

        if (!message) throw new Error('Status message must be provided');
        if (message.length > 128) throw new Error('Status message must be under 128 characters');

        this.activities = [{
            type: typeList[type],
            name: message,
            url: url
        }];

        this.statusMessage = message;

        await this.API.websocket.send(JSON.stringify({
            op: OPCode.PRESENCE_UPDATE,
            d: {
                since: null,
                activities: this.activities,
                status: this.status,
                afk: false
            }
        }));

    }

}


function ValidateOptions(options) {
    if (typeof options !== 'object') throw new TypeError('Client options must be an object, received ' + typeof options);

    if (options.token) {
        if (typeof options.token !== 'string') throw new TypeError('Client token must be a string, received ' + typeof options.token);
        let tokenRegex = /[\w\d]{24,}\.[\w\d]{6,}\.[\w\d\-_]{24,}/;
        if (!tokenRegex.test(options.token)) throw new TypeError('Client token must be a valid token');
        options.token = options.token.match(tokenRegex)[0];
    }

    if (options.applicationID) {
        if (typeof options.applicationID !== 'string') throw new TypeError('Client ID must be a string, received ' + typeof options.applicationID);
        let applicationIDRegex = /[\d]{17,}/;
        if (!options.applicationID.match(applicationIDRegex)) throw new TypeError('Client ID must be a valid application ID');
    }

    if (!options.intents) {
        // throw new TypeError(`Client intents must be provided as an array.
// Example: new Client({\x1b[1m intents: ["guilds", "guildMessages"] \x1b[0m})`);
        
        Logs.error(`No intents were provided, using defaults...`);
        options.intents = [ 'Guilds', 'GuildMessages', 'GuildEmojisAndStickers', 'Voice' ];

    } else {
        if (!Array.isArray(options.intents)) throw new TypeError('Client intents must be an array, received ' + typeof options.intents);
        if (options.intents.some(i => typeof i !== 'string')) throw new TypeError('Client intents must only contain strnigs');
    }

    if (options.maxCacheSize) {
        if (typeof options.maxCacheSize !== 'number') throw new TypeError('Client max cache size must be a number, received ' + typeof options.maxCacheSize);
        if (options.maxCacheSize < 0) throw new TypeError('Client max cache size must be a positive number');
        if (options.maxCacheSize > 1_000) Logs.warn('Client max cache size is over 1,000 - Note that with more servers this can eat up a lot of memory. Use at your own risk.');
    }

    if (options.API_METHOD) {
        if (typeof options.API_METHOD !== 'string') throw new TypeError('Client API method must be a string, received ' + typeof options.API_METHOD);
        options.API_METHOD = options.API_METHOD.toLowerCase();
        if (!['http', 'https', 'rest'].includes(options.API_METHOD)) {
            Logs.warn('Client API method must be HTTPS or REST - Using default: REST');
            options.API_METHOD = 'rest';
        }
    }
}