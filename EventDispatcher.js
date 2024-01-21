const fs = require('node:fs');

module.exports = class EventDispatcher {

	#client = null;

	constructor(client) {
		this.#client = client;

		this.events = new Map();

		this.refreshEvents();
	}

	#AddEvent(event) {
		this.#client.emit('debug', `Registering event '${event.name}'...`);

		if (!event.name) throw new Error('Event name is required');
		if (!event.execute) throw new Error('Event execute function is required');
		
		if (this.events.has(event.name)) this.#client.emit('warn', `Event '${event.name}' is already registered`);

		this.events.set(event.name, event);
	}

	refreshEvents(path = `${__dirname}/Events`, depth = 3) {
		const eventsFolder = fs.readdirSync(path, { withFileTypes: true });
		
		for (const file of eventsFolder) {
			if (file.isDirectory()) {
				if (depth === 0) {
					this.#client.emit('warn', `Event '${file.name}' was not registered due to depth limit`);
					continue;
				}

				this.refreshEvents(`${path}/${file.name}`, depth - 1);
				continue;
			}

			if (!file.name.endsWith('.js')) continue;

			const event = require(`${path}/${file.name}`);

			if (Object.keys(event) === 0) continue;

			this.#AddEvent(event);
		}
	}

	async emit(event, ...args) {
		const eventHandler = this.events.get(event);
		if (!eventHandler) return this.#client.emit(`Event ${event} does not exist - Ignoring...`);

		try {
			await eventHandler.execute(this.#client, ...args);
		} catch (error) {
			console.error(error.stack);
		}
	}

}