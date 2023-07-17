const OPCodes = require('../Constants/OPCodes.js');
const ws = require('ws');
const Queue = require('../DataStructures/Queue.js');
const Logs = require('../Utils/Logs.js');
const Format = require('../Utils/Format.js');
const EventHandler = require('../Utils/EventHandler.js');
const HTTPS = require('node:https');

module.exports = class HTTPManager {
    constructor(client) {
        this.client = client;

        this.callStack = new Queue();

        this._rateLimitUntil = 0;

        this._heartbeatInterval = 41250;
        this._heartbeatTimer = null;
        this._heartbeatAck = true;

        this._seq = null;

        this.connected = false;
        this.connectedAt = null;

        this._WebSocket = null;
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



    async login(token) {

        this.#emitDebug('Logging in...');

        this._WebSocket = new ws('wss://gateway.discord.gg/?v=10&encoding=json');

        this._WebSocket.on('open', () => {
            this.connected = true;
            this.#emitDebug('Opened this._WebSocket');
        });

        this._WebSocket.on('message', async (data) => {
            this.#emitRaw( JSON.parse( data.toString() ) );

            data = JSON.parse(data.toString());

            switch (data.op) {
                case OPCodes.HELLO:
                    this.#emitDebug('Received HELLO');

                    this._WebSocket.send(JSON.stringify({
                        op: OPCodes.IDENTIFY,
                        d: {
                            token: this.client._token,
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
                        this._WebSocket.send(JSON.stringify({
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
                            if (Date.now() - this.client.startTimestamp < 5000) {
                                this.client.guilds.set(data.d.id, data.d);
                                for (const channel of data.d.channels) {
                                    this.client.channels.set(channel.id, channel);
                                }
                                for (const emoji of data.d.emojis) {
                                    this.client.emojis.set(emoji.id, emoji);
                                }
                                for (const role of data.d.roles) {
                                    this.client.roles.set(role.id, role);
                                }
                                for (const sticker of data.d.stickers) {
                                    this.client.stickers.set(sticker.id, sticker);
                                }
                                return;
                            }
                            return this.client.emit('guildCreate', await Format.guild(data.d));
                        default:
                            return await EventHandler(this.client, data.t, data.d);
                    }
                    break;
                default:
                    console.log(data.toString());
                    data = JSON.parse(data.toString());
                    this.#emitDebug(`Received UNKNOWN OPCODE ${data.op}`);
                    break;
            }
        });

        this._WebSocket.on('error', (error) => {
            this.#emitRaw(error);
            this.#emitError(error);
        });

        this._WebSocket.on('close', (code, reason) => {
            this.#emitRaw(`Closed this._WebSocket with code ${code} and reason ${reason ||'No reason'}`);
            this.#emitDebug(`Closed this._WebSocket with code ${code} and reason ${reason || 'No reason'}`);

            this.connected = false;

            if (code === 4001) {
                Logs.error(`Discord has terminated this connection with ${code}.`);
                Logs.error(`If you see this, please report it to the Simplicity Support server.`);
            }

            // Kill the connection and exit
            process.exit(1);
        });

    }



    async get(route, options) {
        if (!this.connected) throw new Error('Client is not connected');

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            HTTPS.get(`https://discord.com/api/v10${route}`, {
                headers: {
                    "Authorization": `Bot ${this.client._token}`
                },
                method: 'GET'
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode !== 200) {
                        this.#emitError(`Received ${res.statusCode} from ${route}`);
                        this.#emitError(data);
                        return reject(data);
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

                    this.client[route.split('/')[1]].set(d.id, d);

                    return resolve(d);
                })
            }, (err) => {
                this.#emitError(err.stack);
                return reject(err);
            });
        });
        
    }
}