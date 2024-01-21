module.exports = {
	name: 'CHANNEL_DELETE',
	async execute(client, data) {
		const channel = await client.channels.get(data.id, { cache: true });
		client.channels.delete(data.id);

		const guild = await client.guilds.get(data.guild_id);
		
		client.emit('channelDelete', channel, guild);
	}
}