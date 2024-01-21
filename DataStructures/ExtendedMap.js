module.exports = class ExtendedMap extends Map {
    constructor (iterable) {
        super(iterable);
    }

    map(fn) {
        for (let i = 0; i < this.length; i++) {
            this[i] = fn(this[i], i);
        }
    }

    filter(fn) {
        const arr = [];
        for (let i = 0; i < this.length; i++) {
            if (fn(this[i], i)) arr.push(this[i]);
        }
        return arr;
    }

    find(fn) {
        for (const [key, value] of this) {
            if (fn(value, key, this)) return value;
        }
        return undefined;
    }

    some(fn) {
        const values = this.values();
        for (let i = 0; i < this.length; i++) {
            if (fn(values[i], i)) return true;
        }
        return false;
    }

    every(fn) {
        const values = this.values();
        for (let i = 0; i < this.length; i++) {
            if (!fn(values[i], i)) return false;
        }
        return true;
    }

    includes(value) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === value) return true;
        }
        return false;
    }

    get length() {
        return this.size;
    }

    get first() {
        return this.values[0];
    }

    get last() {
        return this.values[this.length - 1];
    }
    
    get random() {
        return this.values[Math.floor(Math.random() * this.length)];
    }

    get keys () {
        const arr = [];
        const keys = super.keys();
        for (let i = 0; i < this.length; i++) {
            arr.push(keys[i]);
        }
        return arr;
    }

    get values () {
        const arr = [];
        const values = super.values();
        for (let i = 0; i < this.length; i++) {
            arr.push(values[i]);
        }
        return arr;
    }

    toArray() {
        return [...this];
    }

}