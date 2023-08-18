const SizeLimitedMap = require(`../../DataStructures/SizeLimitedMap.js`);

module.exports = class BaseCache extends SizeLimitedMap {
    constructor(sizeLimit = Infinity) {
        super(sizeLimit);
    }

    async get(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');

        if (this.has(id)) {
            return this.get(id);
        }

        if (options.cache) {
            return this.get(id);
        }

        return await this.fetch(id, options);
    }

    async fetch(id, options) {
        throw new Error('This method is not implemented.');
    }

    random() {
        let keys = Array.from(this.keys());
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.get(randomKey);
    }

}