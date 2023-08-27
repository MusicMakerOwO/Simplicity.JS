module.exports = class ExtendedMap extends Map {
    constructor (iterable) {
        super(iterable);
    }

    map(fn) {
        let arr = [];
        for (let [key, value] of this) {
            arr.push(fn(value, key, this));
        }
        return arr;
    }

    filter(fn) {
        let arr = [];
        for (let [key, value] of this) {
            if (fn(value, key, this)) arr.push(value);
        }
        return arr;
    }

    find(fn) {
        for (let [key, value] of this) {
            if (fn(value, key, this)) return value;
        }
        return undefined;
    }

    some(fn) {
        for (let [key, value] of this) {
            if (fn(value, key, this)) return true;
        }
        return false;
    }

    every(fn) {
        for (let [key, value] of this) {
            if (!fn(value, key, this)) return false;
        }
        return true;
    }

    reduce(fn, initialValue) {
        let accumulator = initialValue;
        for (let [key, value] of this) {
            accumulator = fn(accumulator, value, key, this);
        }
        return accumulator;
    }

    includes(value) {
        for (let [key, val] of this) {
            if (val === value) return true;
        }
        return false;
    }

    keyArray() {
        return [...this.keys()];
    }

    valueArray() {
        return [...this.values()];
    }

    toArray() {
        return [...this];
    }

}