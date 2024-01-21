const BitField = require('../../DataStructures/BitField.js');
const Permissions = require('../../Constants/Permission.js');

const MemberRoleHelper = require('../../Helpers/MemberRoleHelper.js');

module.exports = class Member {

	#client = null;

	constructor(client, data) {

		this.#client = client;

		this.guild_id = data.guild_id;
		this.user_id = data.user_id;

		this.nick = data.nick;
		
		this.roles = new MemberRoleHelper(client, data.roles, data.user_id, data.guild_id);
		
		this.joined_at = data.joined_at;
		this.premium_since = data.premium_since;
		this.deaf = data.deaf;
		this.mute = data.mute;
		this.pending = data.pending;
		this.permissions = new BitField(data.permissions, Permissions);
	}

};