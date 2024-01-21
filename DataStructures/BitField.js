module.exports = class BitField {

	#enums = null;
	
	constructor (bitfield, enums) {
		if (!['number', 'bigint', 'string'].includes(typeof bitfield)) {
			throw new TypeError('Bitfield must be a number, bigint, or string');
		}
		bitfield = BigInt(bitfield);

		if (typeof enums !== 'object') {
			throw new TypeError('Enums must be an object');
		}
		// Must be string:number|bigint
		for (const key in enums) {
			if (!['number', 'bigint'].includes(typeof enums[key])) {
				throw new TypeError('Enums must be an object of string:number|bigint');
			}
		}

		this.bitfield = bitfield;
		this.#enums = enums;

		for (const key in enums) {
			this[key] = this.#has(enums[key]);
		}

		this.None = this.bitfield === 0n;
		this.All = !this.None;
	}

	#has(bit) {
		if (!['number', 'bigint'].includes(typeof bit)) {
			throw new TypeError('Bit must be a number or bigint');
		}
		return (this.bitfield & bit) === bit;
	}

	#add(bit) {
		if (!['number', 'bigint'].includes(typeof bit)) {
			throw new TypeError('Bit must be a number or bigint');
		}
		this.bitfield |= bit;
	}

	#remove(bit) {
		if (!['number', 'bigint'].includes(typeof bit)) {
			throw new TypeError('Bit must be a number or bigint');
		}
		this.bitfield &= ~bit;
	}

	#toggle(bit) {
		if (!['number', 'bigint'].includes(typeof bit)) {
			throw new TypeError('Bit must be a number or bigint');
		}
		this.bitfield ^= bit;
	}

	#refresh() {
		for (const key in this.enums) {
			this[key] = this.#has(this.enums[key]);
		}
	}

	add(...bits) {
		for (const bit of bits) {
			this.#add(bit);
		}
		this.#refresh();
		return this;
	}

	has(key) {
		if (typeof key !== 'string') {
			throw new TypeError('Key must be a string');
		}
		return this[key];
	}

	remove(...bits) {
		for (const bit of bits) {
			if (Array.isArray(bit)) {
				return this.remove(...bit);
			}
			this.#remove(bit);
		}
		this.#refresh();
		return this;
	}

	toggle(...bits) {
		for (const bit of bits) {
			if (Array.isArray(bit)) {
				return this.toggle(...bit);
			}
			this.#toggle(bit);
		}
		this.#refresh();
		return this;
	}

	serialize() {
		return this.bitfield.toString();
	}

	toString() {
		return this.bitfield.toString();
	}

	toArray() {
		const array = [];
		for (const key in this.enums) {
			if (this[key]) {
				array.push(this.enums[key]);
			}
		}
		return array;
	}

}