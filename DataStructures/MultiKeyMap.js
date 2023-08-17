// map object with 2 keys
// map.set('a', 'b', 'some value')

module.exports = class MultiKeyMap {
    constructor(options = {}) {
        this.map = new Map();

        if (options.seperator && typeof options.seperator !== 'string') throw new TypeError('Seperator must be a string');
        this.seperator = options.seperator ?? '::';
    }

    CombinedKeys(keys) {
        return keys.join(this.seperator);
    }

    set(...data) {
        if (data.length < 2) throw new TypeError('Must provide at least 1 key and 1 value');

        let value = data.pop();

        if (data.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        
        let keys = this.CombinedKeys(data);
        if (typeof value === 'undefined') throw new TypeError('Must provide a value');

        this.map.set(keys, value);
    }

    get(...keys) {
        return this.getAll(...keys);
    }

    getAll(...keys) {
        if (keys.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        keys = this.CombinedKeys(keys);
        return this.map.get(keys);
    }

    getAny(...keys) {
        if (keys.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');

        let mapKeys = [...this.map.keys()];
        let found = mapKeys.find(k => k.split(this.seperator).includes(...keys)) ?? [];

        return this.map.get(found);
    }

    has(...keys) {
        return this.hasAll(...keys);
    }

    hasAll(...keys) {
        if (keys.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        keys = this.CombinedKeys(keys);
        return this.map.has(keys);
    }

    hasAny(...keys) {
        if (keys.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        let mapKeys = [...this.map.keys()];
        let found = mapKeys.find(k => k.split(this.seperator).includes(...keys)) ?? [];
        return found.length > 0;
    }

    delete(...keys) {
        return this.deleteAll(...keys);
    }

    deleteAll(...keys) {
        if (keys.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');
        
        keys = this.CombinedKeys(keys);
        this.map.delete(keys);
        
        return true;
    }

    deleteAny(...key) {
        if (key.some(k => typeof k !== 'string')) throw new TypeError('All keys must be strings');

        let keys = [...this.map.keys()];
        let found = keys.find(k => k.split(this.seperator).includes(key)) ?? [];

        this.map.delete(found);

        return found;
    }

    findByValue(value) {
        let entries = [...this.map.entries()];
        let found = entries.filter(([k, v]) => v === value) ?? [];

        found = found.map(([k, v]) => k);

        return found;
    }

    clear() {
        this.map.clear();
    }

    toString() {
        return this.map.toString();
    }

    get size() {
        return this.map.size;
    }


    [Symbol.iterator]() {
        const iterator = this.map.entries();
        return {
            next: () => {
                const result = iterator.next();
                if (result.done) {
                    return { done: true };
                }

                const [keysString, value] = result.value;
                const keys = keysString.split(this.seperator);

                return {
                    value: [keys, value],
                    done: false
                };
            },
            first: () => {
                const result = iterator.first();
                if (result.done) {
                    return { done: true };
                }

                const [keysString, value] = result.value;
                const keys = keysString.split(this.seperator);

                return {
                    value: [keys, value],
                    done: false
                };
            },
            last: () => {
                const result = iterator.last();
                if (result.done) {
                    return { done: true };
                }

                const [keysString, value] = result.value;
                const keys = keysString.split(this.seperator);

                return {
                    value: [keys, value],
                    done: false
                };
            }
        }
    }
}