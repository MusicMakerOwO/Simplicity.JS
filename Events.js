const EventList = require('./Constants/EventList.js')
const Logs = require('./Utils/Logs.js');
const ClosestMatch = require('./Utils/ClosestMatch.js');

module.exports = class Events {

    constructor() {

        this._events = new Map();
        /*
        {
            /event/: [
                {
                    function: function,
                    maxUses: number,
                }
            ],
            /event2/: [
                {
                    function: function,
                    maxUses: number,
                }
            ]
            ...
        }
        */
    }

    #ConvertRegex(name) {
        return name instanceof RegExp ? name : new RegExp(`^${name}$`);
    }

    // client.on('event', (args) => { ... })
    // client.on(/regex/, (args) => { ... })
    on(name, maxUses, callback) {

        if (typeof maxUses === 'function') {
            callback = maxUses;
            maxUses = Infinity;
        }

        if (typeof name === 'string') {
            const closest = ClosestMatch(name, Object.keys(EventList));
            if (closest !== name) {
                Logs.warn(`Unknown event "${name}" - Closest match: "${closest}"`);
            }
            name = EventList[closest];
        }

        name = this.#ConvertRegex(name);

        if (!this._events.has(name)) {
            this._events.set(name, []);
        }

        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (typeof maxUses !== 'number') {
            throw new Error('maxUses must be a number');
        }

        this._events.get(name).push({
            callback,
            maxUses
        });
    }

    async emit(name, ...args) {
        for (const [ regex, callbacks ] of this._events) {
            if (!regex.test(`${name}`)) continue;
            for (const event of callbacks) {
                await event.callback(...args);
                event.maxUses--;
                if (event.maxUses <= 0) {
                    this._events.get(`${regex}`).splice(this._events.get(`${regex}`).indexOf(event.callback), 1);
                }
            }
        }

    }

    clearEvents(name = null) {
        if (name === null) {
            this._events.clear();
        } else {
            name = this.#ConvertRegex(name);
            this._events.delete(name);
        }
    }

    getEvents(name = null) {
        if (name === null) {
            const events = {};
            for (const [ name, callbacks ] of this._events) {
                events[name] = callbacks;
            }
            return events;
        } else {
            name = this.#ConvertRegex(name);
            return this._events.get(`${name}`) ?? [];
        }
    }

    getNames() {
        return [...this._events.keys()];
    }

}