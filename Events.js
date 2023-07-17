const EventList = require('./Constants/EventList.js')
const Logs = require('./Utils/Logs.js');
const ClosestMatch = require('./Utils/ClosestMatch.js');

module.exports = class Events {
    constructor() {
        this._events = new Map();
    }

    addListener(event, listener, maxUsages = Infinity) {
        if (!EventList[event]) {
            let closestMatch = ClosestMatch(event, Object.keys(EventList));
            Logs.warn(`Unknown event "${event}" - Closest match: "${EventList[closestMatch]}"`);
            event = EventList[closestMatch];
        }
        if (!this._events.has(event)) this._events.set(event, []);
        this._events.get(event).push({ listener, maxUsages });
    }

    on(event, listener, maxUsages = Infinity) {
        this.addListener(event, listener, maxUsages);
    }

    once(event, listener) {
        this.on(event, listener, 1);
    }

    emit(event, ...args) {
        if (!this._events.has(event)) return;
        for (let listener of this._events.get(event)) {
            listener.listener(...args);
            if (listener.maxUsages === 1) this.removeListener(event, listener);
            listener.maxUsages--;
        }
    }

    removeEvent(event, listener) {
        if (!this._events.has(event)) return;
        this._events.set(event, this._events.get(event).filter(l => l.listener !== listener));
    }

    clearEvent(event) {
        if (!this._events.has(event)) return;
        this._events.set(event, []);
    }

    clearAllEvents() {
        this._events.clear();
    }

    countEvents(event) {
        if (!this._events.has(event)) return 0;
        return this._events.get(event).length;
    }

    listAllEvents() {
        this.listAllListeners();
    }

    listAllListeners() {
        let listeners = {};
        for (let [event, listenersArray] of this._events) {
            listeners[event] = listenersArray;
        }
        return listeners;
    }

    allEvents() {
        return this.listAllListeners();
    }

    removeListener(event, listener) {
        this.removeEvent(event, listener);
    }

    removeAllEvents() {
        this.clearAllEvents();
    }

}