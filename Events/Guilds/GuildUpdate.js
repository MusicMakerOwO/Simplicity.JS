module.exports = {
	name: 'GUILD_UPDATE',
	async execute(client, newData) {
		const oldData = await client.guilds.get(newData.id, { cache: true });
		client.guilds.set(newData.id, newData);
		client.emit('guildUpdate', oldData, newData);
	}
}