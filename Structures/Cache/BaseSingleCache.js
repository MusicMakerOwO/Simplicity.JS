const SizeLimitedMap = require(`${__dirname}/../../DataStructures/SizeLimitedMap.js`);

module.exports = class BaseCache extends SizeLimitedMap {
    constructor(sizeLimit = Infinity) {
        super(sizeLimit);
    }

    async get(id, options = {}) {
        if (typeof options !== 'object') throw new TypeError('Options must be an object.');

        if (super().has(id)) {
            return super().get(id);
        }

        if (options.cache) {
            return super().get(id);
        }

        return await this.fetch(id, options);
    }

    async fetch(id, options) {
        throw new Error('This method is not implemented.');
    }

    random() {
        let keys = Array.from(super().keys());
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        return super().get(randomKey);
    }

}