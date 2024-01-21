module.exports = {
	name: 'CHANNEL_UPDATE',
	async execute(client, oldChannel, newChannel) {
		const guild = await client.guilds.get(newChannel.guild_id);
		client.emit('channelUpdate', oldChannel, newChannel, guild);
	}
}