const Utils = require('./Utils/UtilsLoader.js')();
const Events = require('./Events.js');
const Logs = require('./Utils/Logs.js');

const CacheLoader = require('./Utils/CacheLoader.js');
let Cache = {};

module.exports = class Client extends Events {
    constructor(options) {

        super();

        ValidateOptions(options);

        Cache = CacheLoader(options.maxCacheSize);

        this._token = options.token;
        this.applicationID = options.applicationID ?? null;
        this.intents = Utils.FormatIntents(options.intents);
        this.user = new Object(null);
        this._currentlyLoggedIn = false;

        this.API_METHOD = options.API_METHOD || 'rest';
        this.API = new Object(null);

        this.startTimestamp = null;


        this.guilds = new Cache.Guilds(this, options.maxCacheSize);
        this.channels = new Cache.Channels(this, options.maxCacheSize);
        this.roles = new Cache.Roles(this, options.maxCacheSize);
        this.emojis = new Cache.Emojis(this, options.maxCacheSize);
        this.stickers = new Cache.Stickers(this, options.maxCacheSize);

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
        throw new TypeError(`Client intents must be provided as an array.
Example: new Client({\x1b[1m intents: ["guilds", "guildMessages"] \x1b[0m})`);
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
        if (/^(https?)|rest/i.test(options.API_METHOD)) Logs.warn('Client API method must be either "https" or "rest" - Using default: REST');
    }
}