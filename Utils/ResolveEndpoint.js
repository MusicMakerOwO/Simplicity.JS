module.exports = ResolveEndpoint;

function ResolveEndpoint(endpoint, ...ids) {

	if (Array.isArray(ids[0])) {
		return ResolveEndpoint(endpoint, ...ids[0]);
	}

	if (typeof endpoint !== 'string') throw new TypeError('Endpoint must be a string');
	if (ids.length === 0) throw new Error('At least one ID must be provided');

	// discord.com/api/v9/channels/123/messages/456

	if (endpoint.endsWith('/')) {
		endpoint = endpoint.slice(0, -1);
	}

	// discord.com/api/v9/guilds/{id}/members/{id} -> discord.com/api/v9/guilds/123/members/456

	for (const id of ids) {
		if (typeof id !== 'string') {
			throw new TypeError('ID must be a string');
		}

		if (!endpoint.includes('{id}')) {
			throw new Error(`More IDs provided than endpoint can handle : ${endpoint}`);
		}

		endpoint = endpoint.replace(/{id}/, id);
	}

	return endpoint;
}