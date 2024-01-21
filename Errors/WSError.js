/*
#sendError(data) {
	if (!data) return this.#emitError('Something went wrong but discord did not specify :(');
	
	let d = null;
	try {
		d = JSON.parse(data);
	} catch (err) {
		this.#emitError(err.stack);
	}
	
	this.#emitError(d || data);

	let error = ErrorCodes[d?.code] ?? data;

	Log.error(JSON.stringify(d, null, 4));

	const lines = error.split('\n');
	for (let i = 0; i < lines.length; i++) {
		if (i === lines.length - 1) {
			Log.error( new Error(lines[i]).stack.replace('Error: ', '') );
		} else {
			Log.error(lines[i]);
		}
	}

	return null;
}
*/

module.exports = class HTTPSError extends Error {
	constructor(route, res, data) {
		// Recieved error code ${res.statusCode} from https://discord.com/api/v10${route}
		// {error message}
		// raw: { ... }
		super(`\x1b[31mRecieved error code ${res.statusCode} from https://discord.com/api/v10${route}\x1b[0m`);
		this.statusCode = res.statusCode;
		this.raw = data;
		this.route = route;
		this.name = 'HTTPSError';
	}
}