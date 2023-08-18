module.exports = class MultiKeyMap extends Map {
    constructor(options = {}) {
        super();
        if (options.seperator && typeof options.seperator !== 'string') throw new TypeError('Seperator must be a string');
        this.seperator = options.seperator ?? '::';
    }

    CombinedKeys(...keys) {
        return keys.join(this.seperator);
    }

    AllData() {
        let data = [];
        for (let [key, value] of this) {
            data.push({ key: key.split(this.seperator), value });
        }
        return data;
    }
    
    set(...data) {
        if (data.length < 2) throw new TypeError('Must provide at least 1 key and 1 value');

        let value = data.pop();

        if (data.some(key => typeof key !== 'string')) throw new TypeError('All keys must be strings');

        let keys = this.CombinedKeys(...data);

        return super.set(keys, value);
    }

    get(...keys) {
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');

        if (keys.length === 1) {
            return this.getAny(...keys);
        } else {
            let key = this.CombinedKeys(...keys);
            return super.get(key);
        }
    }

    getAny(...keys) {
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');

        let allData = this.AllData();
        let data = allData.filter(d => d.key.some(k => keys.includes(k)));
        if (data.length === 0) return undefined;
        return data.map(d => d.value);
    }

    has(...keys) {
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');

        if (keys.length === 1) {
            let allData = this.AllData();
            let data = allData.filter(d => d.key.includes(keys[0]));
            return data.length > 0;
        } else {
            let key = this.CombinedKeys(...keys);
            return super.has(key);
        }
    }

    hasAny(...keys) {
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');

        let allData = this.AllData();
        let data = allData.filter(d => d.key.some(k => keys.includes(k)));
        return data.length > 0;
    }

    delete(...keys) {
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');
        
        if (keys.length === 1) {
            let allData = this.AllData();
            let data = allData.filter(d => d.key.includes(keys[0]));
            if (data.length === 0) return false;
            data.forEach(d => super.delete(d.key));
            return true;
        } else {
            let key = this.CombinedKeys(...keys);
            return super.delete(key);
        }
    }

    deleteAny(...keys) {
        // exact same as delete, but matches all inputs with all keys
        if (keys.length < 1) throw new TypeError('Must provide at least 1 key');

        let allData = this.AllData();
        let data = allData.filter(d => d.key.some(k => keys.includes(k)));
        if (data.length === 0) return false;
        data.forEach(d => super.delete(d.key));
        return true;
    }

    find (callback) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
        let allData = this.AllData();
        let data = allData.find(d => callback(d.value, d.key));
        if (data.length > 0) return data;
        return undefined;
    }

    filter (callback) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
        let allData = this.AllData();
        let data = allData.filter(d => callback(d.value, d.key));
        if (data.length > 0) return data;
        return undefined;
    }

    map (callback) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
        let allData = this.AllData();
        let data = allData.map(d => callback(d.value, d.key));
        if (data.length > 0) return data;
        return undefined;
    }

    forEach (callback) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
        let allData = this.AllData();
        allData.forEach(d => callback(d.value, d.key));
    }

};