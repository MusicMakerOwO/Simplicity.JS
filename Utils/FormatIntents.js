const ClosestMatch = require('./ClosestMatch.js');
const IntentList = require('../Constants/Intents.js');
const Log = require('./Logs.js');

module.exports = (intents) => {
    if (!Array.isArray(intents)) throw new TypeError('Intents must be an array');
    if (intents.some(i => typeof i !== 'string')) throw new TypeError('Intents must only contain strings');

    let intentsBitfield = 0;

    for (const intent of intents) {
        if (!IntentList[intent]) {
            const closestMatch = ClosestMatch(intent, Object.keys(IntentList));
            Log.warn(`Unknown intent "${intent}" - Closest match: "${closestMatch}"`);
            intentsBitfield |= IntentList[closestMatch];
        }
        intentsBitfield |= IntentList[intent]; // bitwise OR : 0001 | 0100 = 0101
    }

    return intentsBitfield |= IntentList.Guilds;
}