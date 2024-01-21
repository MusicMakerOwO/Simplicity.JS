class GuildRole { }

module.exports = class MemberRoles extends Array {

	#client = null;
	#userID = null;
	#guildID = null;

    constructor (client, roles, userID, guildID) {
		super();

		this.#client = client;
		this.#userID = userID;
		this.#guildID = guildID;

		this.#SetSilent(...roles);
	}

	#FlattenArray(array) {
		return array.flat(Infinity);
	}

	#ValidID(id) {
		const regex = /^[0-9]{16,}$/;
		return regex.test(id);
	}

	#SetSilent (...roles) {
		this.length = 0;
		this.#AddSilent(...roles);
	}

	async #AddSilent (...roles) {
		roles = this.#FlattenArray(roles);
		roles = await Promise.all(roles.map(async role => await this.#ConvertRole(role)));
		roles = roles.filter(role => !this.includes(role));
		this.push(...roles);
	}

	async #RemoveSilent (...roles) {
		roles = this.#FlattenArray(roles);
		roles = await Promise.all(roles.map(async role => await this.#ConvertRole(role)));
		roles = roles.filter(role => this.includes(role));

		for (const role of roles) {
			const index = this.indexOf(role);
			if (index === -1) continue;

			this.splice(index, 1);
		}
	}

	async #ConvertRole(role) {
		if (typeof role === 'string') {
			if (!this.#ValidID(role)) throw new TypeError(`Invalid role ID: ${role}`)
			role = await this.#client.roles.get(`${this.#guildID}::${role}`);
		}

		if (role instanceof GuildRole) {
			return role;
		}

		if (typeof role === 'object') {
			return new GuildRole(this.#client, this.#guildID, role);
		}

		else throw new TypeError(`Invalid role : Expected ID or Object, got ${typeof role}`);
	}

	async #UpdateRoles() {
		await this.#client.API.emit('PATCH', `/guilds/${this.#guildID}/members/${this.#userID}`, {
			roles: this.map(role => role.id)
		});
	}

	// Array<ID | GuildRole>
    async add (...roles) {
		roles = this.#FlattenArray(roles);
		this.#AddSilent(...roles);
		await this.#UpdateRoles();
	}

	async remove (...roles) {
		roles = this.#FlattenArray(roles);
		this.#RemoveSilent(...roles);
		await this.#UpdateRoles();
	}

	async set (...roles) {
		roles = this.#FlattenArray(roles);
		this.#SetSilent(...roles);
		await this.#UpdateRoles();
	}

	async has (role) {
		role = await this.#ConvertRole(role);
		return this.includes(role);
	}

}