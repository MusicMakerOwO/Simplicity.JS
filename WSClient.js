const ws = require('ws');
const HTTPS = require('https');

const EventDispatcher = require('./EventDispatcher.js');

const GatewayErrors = require('./Constants/GatewayErrors.js');
const Log = require('./Utils/Logs.js');
const OPCodes = require('./Constants/OPCodes.js');

const WSError = require('./Errors/WSError.js');

module.exports = class WSManager {

    #client = null;
    #token = null;

    constructor(client, token) {
        this.#client = client;
        this.#token = token;
        this.eventDispatcher = new EventDispatcher(client);

        this._seq = null;

        this.connected = false;
        this.connectedAt = null;

        this.websocket = null;

        this._rateLimitUntil = 0;
        this._lastDisconnect = 0;
    }

    #emitRaw(data) {
        this.#client.emit('raw', data);
    }

    #emitDebug(message) {
        this.#client.emit('debug', message);
    }

    #emitError(error) {
        this.#client.emit('error', error);
    }

    #emitWarning(warning) {
        this.#client.emit('warn', warning);
    }

    async login(token = this.#token) {

        this.#emitDebug('Logging in...');

        this.websocket = new ws('wss://gateway.discord.gg/?v=11&encoding=json');

        this.websocket.on('open', () => {
            this.connected = true;
            this.connectedAt = Date.now();
            this.#emitDebug('Opened websocket');
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
                            token: token,
                            properties: {
                                os: process.platform,
                                device: 'Simplicity',
                            },
                            intents: this.#client.intents
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
                    }, data.d.heartbeat_interval * ((Math.random() * 0.5) + 0.5));
                    this.#emitDebug('Received HEARTBEAT');
                case OPCodes.HEARTBEAT_ACK:
                    this.#emitDebug('Received HEARTBEAT_ACK');
                    break;
                case OPCodes.IDENTIFY: // ready event
                    this.#emitDebug('Received READY');
                    break;
                case OPCodes.DISPATCH:
                    this.#emitDebug(`Received DISPATCH ${data.t}`);
                    return this.eventDispatcher.emit(data.t, data.d);
                default:
                    console.log(data.toString());
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
            this.connectedAt = null;

            const errorData = GatewayErrors[code] ?? GatewayErrors['null'];

            Log.error( new Error(`[${errorData.title}] ${errorData.message}`) );

            this.#client.emit('disconnect', code, reason);

            if (!errorData.reconnect) {
                Log.error('Error is not recoverable - Aborting...');
                process.exit(1);
            } else {
                // if the last disconnect was less than 30 seconds ago, don't reconnect
                if (this._lastDisconnect + (1000 * 30) > Date.now()) {
                    throw new Error('Reconnect loop detected, not reconnecting - Last disconnect was less than 30 seconds ago');
                }

                this.#emitDebug('Reconnecting...');
                this.#emitWarning('Reconnecting...');
                this._lastDisconnect = Date.now();
                this.login(token);
            }
        });

    }



    async emit(method, route, data, additionalHeaders = {}) {

        if (this._rateLimitUntil > Date.now()) {
            return null;
        }

        const web = HTTPS.request(`https://discord.com/api/v10${route}`, {
            headers: {
                "Authorization": `Bot ${this.#token}`,
                "Content-Type": "application/json",
                ...additionalHeaders
            },
            method
        }, (res) => {
            let returnedData = '';

            res.on('data', (chunk) => {
                returnedData += chunk;
            });

            res.on('end', async () => {
                if (res.statusCode >= 400) {
                    this.#emitDebug(`Sending ${method} request to https://discord.com/api/v10${route}`);
                    this.#emitDebug(data);
                    throw new WSError(route, res, returnedData);
                }

                this.#emitDebug(`Received ${res.statusCode} from ${route}`);
                this.#emitRaw(returnedData);

                return Parse(returnedData);
            });

            res.on('error', (err) => {
                this.#emitError(err.stack);
                throw new Error(route, res.statusCode, returnedData);
            });

        }, (err) => {
            this.#emitError(err.stack);
            return reject(err);
        });

        if (['POST', 'PATCH', 'PUT'].includes(method)) {
            this.#emitRaw(data);
            web.write(JSON.stringify(data));
        }

        web.end();

    }

};



function Parse(data = null) {
    /*
    "{"some":"data"}" -> { some: 'data' }
    "hello" -> 'hello'
    "123" -> 123
    "{"some":"data" -> Error
    */
    
    if (typeof data === 'object') return data;
    if (data === null) return null;

    if (!CheckSyntax(data)) throw new Error('Invalid JSON Syntax - Aborting...');

    try {
        return JSON.parse(data);
    } catch (err) {
        return data;
    }
}

function CheckSyntax(data) {
    const syntax = [];

    for (const char of data) {
        /*
        ( -> )
        [ -> ]
        { -> }
        " -> "
        */

        if (['[', '{', '"'].includes(char)) {
            syntax.push(char);
        }

        if ([']', '}', '"'].includes(char)) {
            const last = syntax.pop();
            if (last === undefined) {
                return false;
            }

            if (last === '[' && char !== ']') {
                return false;
            }

            if (last === '{' && char !== '}') {
                return false;
            }

            if (last === '"' && char !== '"') {
                return false;
            }
        }

    }

    return syntax.length === 0;
}