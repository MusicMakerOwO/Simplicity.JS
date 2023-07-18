const Queue = require('../DataStructures/Queue.js');
const OPCodes = require('../Constants/OPCodes.js');
const net = require('node:net');
const https = require('node:https');

module.exports = class HTTPSManager {
    constructor(client) {
        this._token = client.token;
        this.appID = client.applicationID;
        this.client = client;
    }

    // Coming soon! Hold tight!

}