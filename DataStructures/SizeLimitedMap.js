const ExtendedMap = require('./ExtendedMap.js');

module.exports = class SizeLimitedMap extends ExtendedMap {
    constructor(maxSize = Infinity) {
        super();
        this.maxSize = maxSize;
    }
  
    set(key, value) {
        if (this.size >= this.maxSize) {
            const firstKey = this.keys().next().value;
            this.delete(firstKey);
        }

        super.set(key, value);
        return this;
    }
    
}
  