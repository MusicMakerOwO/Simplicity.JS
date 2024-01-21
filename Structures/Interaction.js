const PermissionEnums = require('../Constants/Permission.js');
const BitField = require('../DataStructures/BitField.js');

const ConvertMessageContent = require('../Utils/ConvertMessageContent.js');
const OptionTypes = require('../Constants/OptionTypes.js');


/*
Interaction Types: {
	PING: 1
	APPLICATION_COMMAND: 2
	MESSAGE_COMPONENT: 3
	APPLICATION_COMMAND_AUTOCOMPLETE: 4
	MODAL_SUBMIT: 5
}

Component Types: {
	ACTION_ROW: 1
	BUTTON: 2
	SELECT_MENU: 3
	MODAL: 4
}

My types: {
	PING: 1
	COMMAND: 2
	BUTTON: 3
	SELECT_MENU: 4,
	MODAL: 5
	AUTOCOMPLETE: 6
}
*/


/*
{
	version: 1,
	type: 2,
	token: 'aW50ZXJhY3Rpb246MTE4Njc1MjkxNTA1OTI0OTIzMjp4NGc0UGZGSW1pNEh1cjlYSFpkb1VBVFVKeExTVWlRWDcxTEJ2SDlFWTd2bVBmYTk5RElvVm12dUJRSjZZd3lYYXB2NEd6WWNOTG1pU015WFhCS1dKdGJydElYYkl4Sk1jd0tZRE9GdmlhWDFPWk5NaUpXN2FaZzVCU3ZvUFgyUQ',
	member: {
		user: {
			username: 'musicmaker',
			public_flags: 4194432,
			id: '556949122003894296',
			global_name: 'Music Maker',
			discriminator: '0',
			avatar_decoration_data: null,
			avatar: '7da6803394126ea8822e2d3a52341a2a'
		},
		unusual_dm_activity_until: null,
		roles: [
			'948331839829991514',
			'978287544515059722',
			'941129550631415828',
			'1011333547665133642'
		],
		premium_since: null,
		permissions: '562949953421311',
		pending: false,
		nick: null,
		mute: false,
		joined_at: '2019-07-21T02:44:19.534000+00:00',
		flags: 0,
		deaf: false,
		communication_disabled_until: null,
		avatar: null
	},
	locale: 'en-GB',
	id: '1186752915059249232',
	guild_locale: 'en-US',
	guild_id: '602329986463957025',
	guild: {
		locale: 'en-US',
		id: '602329986463957025',
		features: [
			'COMMUNITY',
			'NEWS',
			'TEXT_IN_VOICE_ENABLED',
			'CHANNEL_ICON_EMOJIS_GENERATED'
		]
	},
	entitlements: [],
	entitlement_sku_ids: [],
	data: { type: 1, name: 'setup', id: '1177286153846669426' },
	channel_id: '1087118874031427624',
	channel: {
		type: 0,
		topic: null,
		theme_color: null,
		rate_limit_per_user: 0,
		position: 14,
		permissions: '562949953421311',
		parent_id: '948331642701881394',
		nsfw: false,
		name: 'a',
		last_message_id: '1186369023399694356',
		id: '1087118874031427624',
		icon_emoji: { name: '🌐', id: null },
		guild_id: '602329986463957025',
		flags: 0
	},
	application_id: '1100580118579122258',
	app_permissions: '562949953421311'
}
*/

module.exports = class Interaction {

	static types = [ 'PING', 'COMMAND', 'BUTTON', 'SELECT_MENU', 'MODAL', 'AUTOCOMPLETE' ];
	get types() {
		return Interaction.types;
	}

	static eventNames = [ 'interactionPing', 'slashCommand', 'buttonClick', 'selectMenu', 'modalSubmit', 'autocomplete' ];
	get eventNames() {
		return Interaction.eventNames;
	}

	// Bot token, private
	#token = null;
	#client = null;

	#user = null;
	#member = null;
	#guild = null;
	#channel = null;
	#message = null;

	constructor (interaction, client, token) {
		this.#token = token;
		this.#client = client;

		// console.log( util.inspect(interaction, { depth: undefined, colors: true }) );

		this.guildID = interaction.guild_id;
		this.channelID = interaction.channel_id;

		this.#user = interaction.member?.user ?? interaction.user;
		this.#member = interaction.member;
		this.#guild = interaction.guild;
		this.#channel = interaction.channel;
		this.#message = interaction.message;

		this.user = null;
		this.member = null;
		this.guild = null;
		this.channel = null;
		this.message = null;

		// // Running early to give time for promises while setting up API of object
		// this.#init(interaction);

		// Public token for the interaction
		this.token = interaction.token;

		this.options = interaction.data.options?.[0].options ?? [];
		this.options.map(option => 
			option.type = OptionTypes[option.type]
		);

		this.#client.user.id = interaction.id;
		this.type = this.#defineType(interaction);
		this.deffered = false;
		this.replied = false;
		this.shownModal = false;

		this.command = {
			id: interaction.data.id,
			name: interaction.data.name
		}

		// Blame discord for making so many optional fields
		this.subCommand = interaction.data?.options?.[0].name ?? null;
		this.subCommandGroup = interaction.data?.options?.[0].options?.[0]?.name ?? null;
		this.customID = interaction.data?.custom_id ?? null;

		this.locale = interaction.locale;

		this.version = interaction.version;

		this.permissions = new BitField(interaction.app_permissions, PermissionEnums);
		this.applicationID = interaction.application_id;
	}

	async init() {

		// Users, guilds, and channels can all be partials
		// Need to go through cache and/or fetch to enture they are complete
		this.user = await this.#client.users.get(this.#user?.id ?? this.#member?.user.id);

		if ("id" in (this.#guild ?? {})) {
			this.guild = await this.#client.guilds.get(this.#guild.id);
		}

		if ("id" in (this.#channel ?? {})) {
			this.channel = await this.#client.channels.get(this.#channel.id);
		}

		// Members are only accesible if you have the guild members intent
		// Guild object will have a small cache manager to query the client cache
		if ("user" in (this.#member ?? {})) {
			// this.member = new Member(this.#member, this.#guild, this.#client, this.#token);
		}

		// Messages exist only on message components: buttons, select menus, and modals
		if ("id" in (this.#message ?? {})) {
			this.message = await this.channel.messages.get(this.#message.id);
		}

		return this;
	}

	#defineType(interaction) {
		switch (interaction.type) {
			case 1:
			case 2:
				return interaction.type;
			case 3:
				if (interaction.data.component_type === 2) return 3;
				if (interaction.data.component_type === 3) return 4;
				if (interaction.data.component_type === 4) return 5;
				throw new Error(`Unknown component type ${interaction.data.component_type}`);
			case 4:
				return 6;
			default:
				throw new Error(`Unknown interaction type ${interaction.type}`);
		}
	}

	/////////////////
	// METADATA
	/////////////////
	get isPing() {
		return this.type === 1;
	}

	get isCommand() {
		return this.type === 2;
	}

	get isButton() {
		return this.type === 3;
	}

	get isSelectMenu() {
		return this.type === 4;
	}

	get isModal() {
		return this.type === 5;
	}

	get isAutocomplete() {
		return this.type === 6;
	}





	/////////////////
	// OPTIONS
	/////////////////
	#GetOption(name, type) {
		return this.options.find(option => option.name === name.toLowerCase() && option.type === type)?.value ?? null;
	}

	getString(name) {
		return this.#GetOption(name, 3);
	}

	getInteger(name) {
		return this.#GetOption(name, 4);
	}

	getBoolean(name) {
		return this.#GetOption(name, 5);
	}

	getUser(name) {
		const userID = this.#GetOption(name, 6);
		return this.#client.users.get(userID);
	}

	#GetMember(userID) {
		return async () => {
			const member = await this.guild.members.get(userID);
			return member;
		}
	}

	getMember(name) {
		const userID = this.#GetOption(name, 6);
		return this.#GetMember(userID);
	}

	getChannel(name) {
		return this.#GetOption(name, 7);
	}

	getRole(name) {
		return this.#GetOption(name, 8);
	}

	getMentionable(name) {
		return this.#GetOption(name, 9);
	}

	getNumber(name) {
		return this.#GetOption(name, 10);
	}

	getSubCommand() {
		return this.subCommand;
	}

	getSubCommandGroup() {
		return this.subCommandGroup;
	}

	getCustomID() {
		return this.customID;
	}

	/////////////////
	// RESPONSES
	/////////////////

	async deferResponse(content = {}) {
		return await this.deferReply(content);
	}

	async deferReply(content = {}) {

		if (this.showModal) throw new Error('Cannot defer a reply after showing a modal');
		if (this.isAutocomplete) throw new Error('Cannot defer reply on an autocomplete');

		if (!this.deffered && !this.replied) {
			await this.#client.API.emit(
				'POST',
				`/interactions/${this.#client.user.id}/${this.token}/callback`,
				{
					type: 5,
					data: {
						flags: content.hidden ? 1 << 6 : 0
					}
				}
			);

			this.deffered = true;
		}

		// If options contains more than just hidden, edit the reply
		if (Object.keys(content).length > 1) {
			await this.editReply(content);
		}
	}

	async deferUpdate(content = {}) {

		if (this.showModal) throw new Error('Cannot defer a reply after showing a modal');
		if (this.isAutocomplete) throw new Error('Cannot defer update on an autocomplete');

		if (this.isCommand) {
			return await this.deferReply(content);
		}

		if (!this.deffered && !this.replied) {
			await this.#client.API.emit(
				'PATCH',
				`/webhooks/${this.applicationID}/${this.token}/messages/@original`,
				{
					type: 6
				}
			);
			
			this.deffered = true;
		}

		if (Object.keys(content).length > 1) {
			await this.editReply(content);
		}
	}

	async reply(content) {

		if (this.showModal) throw new Error('Cannot reply after showing a modal');

		if (this.isAutocomplete) return this.respond(content);

		if (this.replied || this.deffered) return this.editReply(content);

		const data = await this.#client.API.emit(
			'POST',
			`/interactions/${this.#client.user.id}/${this.token}/callback`,
			{
				type: 4,
				data: ConvertMessageContent(content)
			}
		);

		this.replied = true;
		return data;
	}

	async editReply(content) {

		if (this.isAutocomplete) throw new Error('Cannot edit reply on an autocomplete');
		if (this.showModal) throw new Error('Cannot edit a reply after showing a modal');

		if (!this.replied && !this.deffered) return this.reply(content);

		const data = await this.#client.API.emit(
			'PATCH',
			`/webhooks/${this.applicationID}/${this.token}/messages/@original`,
			ConvertMessageContent(content)
		);

		return data;
	}

	async deleteReply() {

		if (this.isAutocomplete) throw new Error('Cannot delete reply on an autocomplete');
		if (this.showModal) throw new Error('Cannot delete a reply after showing a modal');

		if (!this.deffered && !this.replied) {
			if (this.isCommand) {
				await this.deferReply({ hidden: true });
			} else {
				await this.deferUpdate();
			}
		}

		await this.#client.API.emit(
			'DELETE',
			`/webhooks/${this.applicationID}/${this.token}/messages/@original`
		);
	}

	async fetchReply() {

		if (this.isAutocomplete) throw new Error('Cannot fetch reply on an autocomplete');
		if (this.showModal) throw new Error('Cannot fetch a reply after showing a modal');

		const data = await this.#client.API.emit(
			'GET',
			`/webhooks/${this.applicationID}/${this.token}/messages/@original`
		);

		return data;
	}

	async showModal(modal) {
		if (this.isAutocomplete) throw new Error('Cannot show a modal on an autocomplete');
		if (this.deffered) throw new Error('Cannot show a modal after deferring a reply');
		if (this.replied) throw new Error('Cannot show a modal after replying');

		await this.#client.API.emit(
			'POST',
			`/interactions/${this.#client.user.id}/${this.token}/callback`,
			{
				type: 9,
				data: modal.toJSON()
			}
		);

		this.shownModal = true;
	}

	// autocomplete only
	// [ { name: 'test', value: 'test'}, ... ]
	async respond(...data)	{
		if (!this.isAutocomplete) return await this.reply(data);

		if (this.replied || this.deffered) return await this.editReply(data);

		const regex = /^[a-z0-9_-]{1,32}$/;
		for (const option of data) {
			if (typeof option !== 'object') throw new TypeError('Option must be an object');
			
			if (typeof option.name !== 'string') throw new TypeError('Option name must be a string');
			if (typeof option.value !== 'string') throw new TypeError('Option value must be a string');

			if (!regex.test(option.value)) throw new Error('Option values must be lowecase letters, numbers, underscores, or dashes');
			if (option.value.length > 32 || option.value.length < 1) throw new Error('Option values must be between 1 and 32 characters');
			if (option.name.length > 32 || option.name.length < 1) throw new Error('Option names must be between 1 and 32 characters');
		}

		await this.#client.API.emit(
			'POST',
			`/interactions/${this.#client.user.id}/${this.token}/callback`,
			{
				type: 8,
				data: {
					choices: data
				}
			}
		);
	}

}