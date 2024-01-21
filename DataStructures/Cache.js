const ResolveEndpoint = require('../Utils/ResolveEndpoint.js');

module.exports = class Cache {
	#client = null;
	#strong = true;

	constructor(client, endpoint, exportClass, { sizeLimit = 2 ** 24, strong = true } = {}) {
		this.#client = client;
		this.#strong = strong;
		this.sizeLimit = sizeLimit;
		this.endpoint = endpoint;
		this.exportClass = exportClass;

		this.cache = new Map();
	}

	#add(key, value) {
		if (this.cache.size >= this.sizeLimit) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}

		if (this.#strong) {
			this.cache.set(key, value);
		} else {
			if (typeof value !== 'object') throw new TypeError('Value must be an object in weak mode');
			this.cache.set(key, new WeakRef(value));
		}
	}

	#getValue(id) {
		if (this.#strong) {
			return this.cache.get(id);
		} else {
			return this.cache.get(id).deref();
		}
	}

	#export(value) {
		if (this.exportClass) {
			return new this.exportClass(this.#client, value);
		} else {
			return value;
		}
	}

	set(id, value) {
		if (typeof id !== 'string') throw new TypeError('ID must be a string');
		return this.#add(id, value);
	}

	async get(id, { cache } = {}) {

		if (cache === false) {
			return this.fetch(id, options);
		}

		if (cache === true) {
			const data = this.#getValue(id);
			return this.#export(data);
		}

		if (this.has(id)) {
			const data = this.#getValue(id);
			return this.#export(data);
		} else {
			const data = await this.fetch(id);
			this.#add(id, data);
			return data;
		}
	}

	async fetch(id, options = {}) {
		if (!id) throw new TypeError('ID must be provided');
		const endpoint = ResolveEndpoint(this.endpoint, id.split('::'));

		const data = await this.#client.API.emit('GET', endpoint, options);
		
		this.#add(id, data);
		return data;
	}

	has(id) {
		return this.cache.has(id);
	}

	delete(id) {
		return this.cache.delete(id);
	}

	clear() {
		return this.cache.clear();
	}

	random() {
		const keys = Array.from(this.cache.keys());
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		return this.get(randomKey);
	}

	get size() {
		return this.cache.size;
	}

	get maxSize() {
		return this.sizeLimit;
	}

}