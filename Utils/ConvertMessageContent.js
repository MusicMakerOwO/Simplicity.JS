const Logs = require('./Logs.js');

module.exports = function ConvertMessageContent(data) {
	if (typeof data === 'string') {
		return {
			content: data
		};
	}

	const fields = {
		content: {
			type: 'string',
			check: (data) => typeof data === 'string' || data instanceof String,
			required: false
		},
		embeds: {
			type: 'array',
			check: (data) => Array.isArray(data),
			required: false
		},
		components: {
			type: 'array',
			typeCheck: (data) => Array.isArray(data),
			required: false
		},
		hidden: {
			type: 'boolean',
			check: (data) => typeof data === 'boolean',
			required: false
		}
	}

	const converted = {};

	for (const key in fields) {
		if (key in data) {
			if (fields[key].check(data[key])) {
				converted[key] = data[key];
			} else {
				throw new TypeError(`Invalid form body: ${key} must be of type ${fields[key].type}, got ${typeof data[key]}`);
			}
		} else {
			if (fields[key].required) {
				throw new TypeError(`Invalid form body: ${key} is required`);
			}
		}
	}

	for (const key in data) {
		if (!(key in fields)) {
			Logs.warn(`Unknown key '${key}' in message, ignoring...`);
		}
	}

	converted.flags = data.hidden ? 1 << 6 : 0;

	if (Object.keys(converted).length === 0) {
		throw new TypeError('Invalid form body: Cannot send an empty message');
	}

	return converted;
}