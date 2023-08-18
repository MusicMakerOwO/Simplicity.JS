const SizeLimitedMultiKeyMap = require('../SizeLimitedMultiKeyMap.js');

module.exports = class BaseCache extends SizeLimitedMultiKeyMap {
    constructor(sizeLimit = Infinity) {
        super(sizeLimit);
    }

    async get(...data) {
        // if the last argument is an object, it's options
        if (data.length < 1) throw new TypeError('Must provide at least 1 key');

        let options = typeof data[data.length - 1] === 'object' ? data.pop() : {};
        if (options.cache === undefined) options.cache = true;

        if (super().has(...data)) {
            return super().get(...data);
        }

        if (options.cache === false) {
            return await this.fetch(...data, options);
        }

        return super().getAny(...data);
    }

    async fetch(id, options) {
        throw new Error('This method is not implemented.');
    }

}