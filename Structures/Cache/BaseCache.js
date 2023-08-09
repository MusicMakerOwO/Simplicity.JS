const SizeLimitedMap = require(`${__dirname}/../../DataStructures/SizeLimitedMap.js`);

module.exports = class BaseCache {
    constructor(client, sizeLimit = Infinity) {
        this.cache = new SizeLimitedMap( sizeLimit );
        this.API = client.API;
    }

    async get(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');

        if (this.cache.has(id)) {
            return this.cache.get(id);
        }

        if (options.cache) {
            return this.cache.get(id);
        }

        return await this.fetch(id, options);
    }

    async fetch(id, options) {
        throw new Error('This method is not implemented.');
    }

    random() {
        let keys = [...this.cache.keys()];
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.cache.get(randomKey);
    }

    find(fn) {
        if (typeof fn !== 'function') throw new TypeError('Function must be a function.');

        let results = new Map();
        for (let [key, value] of this.cache) {
            if (fn(value)) results.set(key, value);
        }

        return results;
    }

    filter(fn) {
        return this.find(fn);
    }

    set(id, data) {
        if (!id) throw new Error('ID must be provided.');
        if (typeof data !== 'object') throw new TypeError('Data must be an object.');
        this.cache.set(id, data);
    }

    delete(id) {
        if (!id) throw new Error('ID must be provided.');
        this.cache.delete(id);
    }

    clear() {
        this.cache.clear();
    }

    count() {
        return this.cache.size;
    }

    all() {
        return this.cache;
    }

}