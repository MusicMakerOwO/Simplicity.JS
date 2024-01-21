module.exports = {
	name: 'GUILD_DELETE',
	async execute(client, data) {
		// Fetch any remaining data from cache and delete it
		// Don't need to worry of the other caches because they are weak
		const guild = await client.guilds.get(data.id, { cache: true });
		const channels = await client.channels.get(data.id, { cache: true });

		await guild.init();

		client.emit('guildLeave', guild);
	}
}