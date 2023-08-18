const OPCodes = require('./Constants/OPCodes.js');
const ws = require('ws');
const Log = require('./Utils/Logs.js');
const Format = require('./Utils/Format.js');
const EventHandler = require('./Utils/EventHandler.js');
const GatewayErrors = require('./Constants/GatewayErrors.js');
const ErrorCodes = require('./Constants/ErrorCodes.js');
const HTTPS = require('https');
const Intent = require('./Constants/Intents.js');

let _token = null;
let headers = {};

module.exports = class RESTManager {
    constructor(client, token) {
        this.client = client;

        _token = token;
        headers = {
            "Authorization": `Bot ${_token}`,
            "Content-Type": "application/json"
        };

        this._seq = null;

        this.connected = false;
        this.connectedAt = null;

        this.websocket = null;
    }

    #emitRaw(data) {
        this.client.emit('raw', data);
    }

    #emitDebug(message) {
        this.client.emit('debug', message);
    }

    #emitError(error) {
        this.client.emit('error', error);
    }

    #emitWarning(warning) {
        this.client.emit('warn', warning);
    }

    #sendError(data) {
        let d = null;
        try {
            d = JSON.parse(data);
        } catch (err) {
            this.#emitError(err.stack);
        }
        
        this.#emitError(d || data);

        let error = ErrorCodes[d.code];
        if (!error) error = 'Unknown error';

        Log.error(JSON.stringify(d, null, 4));

        const lines = error.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (i === lines.length - 1) {
                Log.error( new Error(lines[i]).stack.replace('Error: ', '') );
            } else {
                Log.error(lines[i]);
            }
        }

        return null;
    }



    async login(token) {

        this.#emitDebug('Logging in...');

        this.websocket = new ws('wss://gateway.discord.gg/?v=11&encoding=json');


        this.websocket.on('open', () => {
            this.connected = true;
            this.#emitDebug('Opened this.websocket');
        });

        this.websocket.on('message', async (data) => {
            this.#emitRaw( JSON.parse( data.toString() ) );

            data = JSON.parse(data.toString());

            switch (data.op) {
                case OPCodes.HELLO:
                    this.#emitDebug('Received HELLO');

                    this.websocket.send(JSON.stringify({
                        op: OPCodes.IDENTIFY,
                        d: {
                            token: _token,
                            properties: {
                                os: process.platform,
                                device: 'Simplicity',
                            },
                            intents: this.client.intents
                        }
                    }));
                case OPCodes.HEARTBEAT:
                    this._seq = data.d;
                    setInterval(() => {
                        this.#emitDebug('Sending HEARTBEAT');
                        this.websocket.send(JSON.stringify({
                            op: OPCodes.HEARTBEAT,
                            d: this._seq
                        }));
                    }, data.d.heartbeat_interval * Math.random());
                    this.#emitDebug('Received HEARTBEAT');
                case OPCodes.HEARTBEAT_ACK:
                    this.#emitDebug('Received HEARTBEAT_ACK');
                    break;
                case OPCodes.IDENTIFY: // ready event
                    this.#emitDebug('Received READY');
                    break;
                case OPCodes.DISPATCH:
                    this.#emitDebug(`Received DISPATCH ${data.t}`);
                    switch (data.t) {
                        case 'READY':
                            this.client.connectedAt = new Date();
                            this.client.user = data.d.user;
                            this.#emitDebug(`Logged in as ${this.client.user.username}#${this.client.user.discriminator}`);

                            this.client.emit('ready', this.client.user);
                            break;
                        case 'GUILD_CREATE':
                            // Don't emit this event if the client logged in less than 5 seconds ago
                            if (Date.now() - this.client.startTimestamp < 2000) {
                                this.client.guilds.set(data.d.id, data.d);
                                for (const channel of data.d.channels) {
                                    this.client.channels.set(data.d.id, channel.id,
                                        Object.assign(channel, { guildID: data.d.id })
                                    );
                                }
                                for (const emoji of data.d.emojis) {
                                    this.client.emojis.set(data.d.id, emoji.id,
                                        {
                                            ...emoji,
                                            guildID: data.d.id,
                                            url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?size=1024`
                                        }
                                    );
                                }
                                for (const role of data.d.roles) {
                                    this.client.roles.set(data.d.id, role.id,
                                        Object.assign(role, { guildID: data.d.id })
                                    );
                                }
                                for (const sticker of data.d.stickers) {
                                    this.client.stickers.set(data.d.id, sticker.id,
                                        {
                                            ...sticker,
                                            guildID: data.d.id,
                                            url: `https://cdn.discordapp.com/stickers/${sticker.id}.${sticker.format}?size=1024`
                                        }
                                    );
                                }
                                // bitwise AND : 0111 & 0010 = 0010
                                if (this.client.intents & Intent.GuildMembers) {
                                    try {
                                        let members = await this.getBulk(`/guilds/${data.d.id}/members`);
                                        for (const member of members) {
                                            this.client.members.set(data.d.id, member.user.id,
                                                Object.assign(member, { guildID: data.d.id })
                                            );
                                        }
                                    } catch (err) {
                                        this.#emitError(err.stack);
                                    }
                                }
                                return;
                            }
                            return this.client.emit('guildCreate', await Format.guild(data.d));
                        case 'GUILD_DELETE':
                            return this.client.emit('guildDelete', await Format.guild(data.d));
                        case 'GUILD_UPDATE':
                            this.client.guilds.set(data.d.id, data.d);
                            return this.client.emit('guildUpdate', await Format.guild(data.d));
                        // for voice information, check Simplicity/Voice/VoiceClient.js
                        default:
                            return await EventHandler(this.client, data.t, data.d);
                    }
                    break;
                default:
                    console.log(data.toString());
                    //data = JSON.parse(data.toString());
                    this.#emitDebug(`Received UNKNOWN OPCODE ${data.op}`);
                    break;
            }
        });

        this.websocket.on('error', (error) => {
            this.#emitRaw(error);
            this.#emitError(error);
        });

        this.websocket.on('close', (code, reason) => {
            this.#emitRaw(`Closed WebSocket with code ${code} and reason ${reason || 'No reason'}`);
            this.#emitDebug(`Closed Websocket with code ${code} and reason ${reason || 'No reason'}`);

            this.connected = false;

            let error = GatewayErrors[code];
            if (!error) error = 'Unknown error';

            // split on each line and print them
            const lines = error.split('\n');
            for (let i = 0; i < lines.length; i++) {
                // if the last line, throw it as an error
                if (i === lines.length - 1) {
                    Log.error( new Error(lines[i]).stack.replace('Error: ', '') );
                } else {
                    Log.error(lines[i]);
                }
            }

            

            // Kill the connection and exit
            process.exit(1);
        });

    }



    async get(route) {
        if (!this.connected) throw new Error('Client is not connected');

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            HTTPS.get(`https://discord.com/api/v10${route}`, {
                headers,
                method: 'GET'
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode !== 200) {
                        return this.#sendError(data);
                    }

                    this.#emitDebug(`Received ${res.statusCode} from ${route}`);
                    this.#emitRaw(data);

                    let d = {};
                    try {
                        d = JSON.parse(data);
                    } catch (err) {
                        this.#emitError(err.stack);
                        return reject(err);
                    }

                    return resolve(d);
                });

                res.on('error', (err) => {
                    this.#emitError(err.stack);
                    return reject(err);
                });
                
            }, (err) => {
                this.#emitError(err.stack);
                return reject(err);
            });
        });
    }



    async getBulk(route) {
        if (!this.connected) throw new Error('Client is not connected');

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            HTTPS.get(`https://discord.com/api/v10${route}?limit=1000`, {
                headers,
                method: 'GET'
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode !== 200) {
                        return this.#sendError(data);
                    }

                    this.#emitDebug(`Received ${res.statusCode} from ${route}`);
                    this.#emitRaw(data);

                    let d = {};
                    try {
                        d = JSON.parse(data);
                    } catch (err) {
                        this.#emitError(err.stack);
                        return reject(err);
                    }

                    if (Array.isArray(d)) {
                        for (const member of d) {
                            // copy member.user to member
                            for (const key in member.user) {
                                member[key] = member.user[key];
                            }
                        }
                    } else {
                        for (const key in d.user) {
                            d[key] = d.user[key];
                        }
                    }

                    return resolve(d);
                });

                res.on('error', (err) => {
                    this.#emitError(err.stack);
                    return reject(err);
                });

            }, (err) => {
                this.#emitError(err.stack);
                return reject(err);
            });
        });
    }



    async post(route, data, method = 'POST') {
        if (!this.connected) throw new Error('Client is not connected');

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            // https post request
            const req = HTTPS.request(`https://discord.com/api/v10${route}`, {
                headers,
                method: method
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode !== 200) {
                        return this.#sendError(data);
                    }

                    this.#emitDebug(`Received ${res.statusCode} from ${route}`);
                    this.#emitRaw(data);

                    let d = {};
                    try {
                        d = JSON.parse(data);
                    } catch (err) {
                        this.#emitError(err.stack);
                    }

                    return resolve(d);
                });

                res.on('error', (err) => {
                    this.#emitError(err.stack);
                    return reject(err);
                });
            });

            req.write(JSON.stringify(data));
            req.end();
        });
    }


    async edit(route, data) {
        if (!this.connected) throw new Error('Client is not connected');

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const web = HTTPS.request(`https://discord.com/api/v10${route}`, {
                headers,
                method: 'PATCH'
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode !== 200) {
                        return this.#sendError(data);
                    }

                    this.#emitDebug(`Received ${res.statusCode} from ${route}`);
                    this.#emitRaw(data);

                    let d = {};
                    try {
                        d = JSON.parse(data);
                    } catch (err) {
                        this.#emitError(err.stack);
                    }

                    return resolve(d);
                });

                res.on('error', (err) => {
                    this.#emitError(err.stack);
                    return reject(err);
                });

            }, (err) => {
                this.#emitError(err.stack);
                return reject(err);
            });

            web.write(JSON.stringify(data));

            web.end();
        });
    }

};
