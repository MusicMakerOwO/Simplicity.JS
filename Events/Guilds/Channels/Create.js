module.exports = {
	name: 'CHANNEL_CREATE',
	async execute(client, data) {
		const channel = await client.channels.get(data.id);
		client.channels.set(data.id, channel);

		const guild = await client.guilds.get(data.guild_id);

		client.emit('channelCreate', channel, guild);
	}
}