module.exports = {
	name: 'GUILD_CREATE',
	async execute(client, data) {
		for (const emoji of data.emojis) {
			// key: 'guildID::emojiID'
			client.emojis.set(`${data.id}::${emoji.id}`, emoji);
		}

		for (const role of data.roles) {
			client.roles.set(`${data.id}::${role.id}`, role);
		}

		for (const member of data.members) {
			client.members.set(`${data.id}::${member.user.id}`, member);
		}

		for (const sticker of data.stickers) {
			client.stickers.set(`${data.id}::${sticker.id}`, sticker);
		}

		client.guilds.set(data.id, data);

		return client.emit('guildJoin', await client.guilds.get(data.id));
	}
}