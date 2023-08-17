const SizeLimitedMultiKeyMap = require(`${__dirname}/../../DataStructures/SizeLimitedMultiKeyMap.js`);

module.exports = class BaseCache {
    constructor(sizeLimit = Infinity) {
        this.cache = new SizeLimitedMultiKeyMap( sizeLimit );
    }

    CombinedKey(...ids) {
        return ids.join('::');
    }

    async get(...ids) {
        if (ids.length === 0) throw new Error('At least one ID must be provided.');
        if (ids.length === 1) return this.cache.get(ids[0]);

        let combinedKey = this.CombinedKey(...ids);
        if (this.cache.has(combinedKey)) {
            return this.cache.get(combinedKey);
        }

        return await this.fetch(...ids);
    }

    async fetch(...ids) {
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
        for (let [keys, value] of this.cache) {
            if (fn(value)) results.set(keys, value);
        }

        return results;
    }

    filter(fn) {
        return this.find(fn);
    }

    set(...ids) {
        let data = ids?.pop();

        if (ids.length === 0) throw new Error('At least one ID must be provided.');
        if (ids.some(id => typeof id !== 'string')) throw new TypeError('All IDs must be strings.');
        
        if (typeof data !== 'object') throw new TypeError('Data must be an object.');

        let combinedKey = this.CombinedKey(...ids);
        this.cache.set(combinedKey, data);

        return this;
    }

    delete(...ids) {
        if (ids.length === 0) throw new Error('At least one ID must be provided.');

        let combinedKey = this.CombinedKey(...ids);
        this.cache.delete(combinedKey);

        return this;
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