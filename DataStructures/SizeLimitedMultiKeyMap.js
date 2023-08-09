const MultiKeyMap = require('./MultiKeyMap.js');

module.exports = class LimitedMultiKeyMap extends MultiKeyMap {
    constructor(maxSize = Infinity) {
        super();
        this.maxSize = maxSize;
    }

    set(...data) {
        if (data.length < 2) throw new TypeError('Must provide at least 1 key and 1 value');

        let value = data.pop();

        if (data.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        
        let keys = super.CombinedKeys(data);
        if (typeof value === 'undefined') throw new TypeError('Must provide a value');

        this.map.set(keys, value);

        if (this.map.size > this.maxSize) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
        }
    }
    
}