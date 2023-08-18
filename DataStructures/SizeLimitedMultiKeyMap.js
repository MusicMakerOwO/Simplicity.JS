const MultiKeyMap = require('./MultiKeyMap.js');

module.exports = class LimitedMultiKeyMap extends MultiKeyMap {
    constructor(maxSize = Infinity) {
        super();
        this.maxSize = maxSize;
    }

    set(...data) {
        if (data.length < 2) throw new TypeError('Must provide at least 1 key and 1 value');

        let value = data.pop();

        if (data.some(key => typeof key !== 'string')) throw new TypeError('All keys must be strings');
        
        if (typeof value === 'undefined') throw new TypeError('Must provide a value');

        super.set(...data, value);

        if (this.size > this.maxSize) {
            const firstKey = super.keys().next().value;
            this.delete(firstKey);
        }
    }
    
}