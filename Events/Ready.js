module.exports = {
	name: 'READY',
	async execute(client, data) {
		client.user = data.user;
		client.sessionID = data.session_id;
		client.connectedAt = Date.now();
		return client.emit('ready', client);
	}
}