const Member = require('../../../Structures/GuildData/Member.js');

module.exports = {
	name: 'GUILD_MEMBER_ADD',
	async execute(client, data) {
		client.members.set(`${data.guild_id}::${data.id}`, data);

		const member = await client.members.get(`${data.guild_id}::${data.id}`, { cache: true });

		const guild = await client.guilds.get(data.guild_id);
		
		client.emit('guildMemberAdd', member, guild);
	}
}