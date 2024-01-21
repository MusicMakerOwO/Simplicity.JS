/*
id	snowflake	guild id
name	string	guild name (2-100 characters, excluding trailing and leading whitespace)
icon	?string	icon hash
icon_hash?	?string	icon hash, returned when in the template object
splash	?string	splash hash
discovery_splash	?string	discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
owner? *	boolean	true if the user is the owner of the guild
owner_id	snowflake	id of owner
permissions? *	string	total permissions for the user in the guild (excludes overwrites and implicit permissions)
region? **	?string	voice region id for the guild (deprecated)
afk_channel_id	?snowflake	id of afk channel
afk_timeout	integer	afk timeout in seconds
widget_enabled?	boolean	true if the server widget is enabled
widget_channel_id?	?snowflake	the channel id that the widget will generate an invite to, or null if set to no invite
verification_level	integer	verification level required for the guild
default_message_notifications	integer	default message notifications level
explicit_content_filter	integer	explicit content filter level
roles	array of role objects	roles in the guild
emojis	array of emoji objects	custom guild emojis
features	array of guild feature strings	enabled guild features
mfa_level	integer	required MFA level for the guild
application_id	?snowflake	application id of the guild creator if it is bot-created
system_channel_id	?snowflake	the id of the channel where guild notices such as welcome messages and boost events are posted
system_channel_flags	integer	system channel flags
rules_channel_id	?snowflake	the id of the channel where Community guilds can display rules and/or guidelines
max_presences?	?integer	the maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
max_members?	integer	the maximum number of members for the guild
vanity_url_code	?string	the vanity url code for the guild
description	?string	the description of a guild
banner	?string	banner hash
premium_tier	integer	premium tier (Server Boost level)
premium_subscription_count?	integer	the number of boosts this guild currently has
preferred_locale	string	the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US"
public_updates_channel_id	?snowflake	the id of the channel where admins and moderators of Community guilds receive notices from Discord
max_video_channel_users?	integer	the maximum amount of users in a video channel
max_stage_video_channel_users?	integer	the maximum amount of users in a stage video channel
approximate_member_count?	integer	approximate number of members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds endpoints when with_counts is true
approximate_presence_count?	integer	approximate number of non-offline members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds endpoints when with_counts is true
welcome_screen?	welcome screen object	the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
nsfw_level	integer	guild NSFW level
stickers?	array of sticker objects	custom guild stickers
premium_progress_bar_enabled	boolean	whether the guild has the boost progress bar enabled
safety_alerts_channel_id	?snowflake	the id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
*/


const GuildRoleHelper = require('../Helpers/GuildRoles.js');
// const GuildMemberHelper = require('../Helpers/GuildMembers.js');
// const GuildChannelHelper = require('../Helpers/GuildChannels.js');
// const GuildEmojiHelper = require('../Helpers/GuildEmojis.js');
// const GuildStickerHelper = require('../Helpers/GuildStickers.js');
// const GuildInviteHelper = require('../Helpers/GuildInvites.js');
// const GuildBanHelper = require('../Helpers/GuildBans.js');

module.exports = class Guild {

    #client = null;

    constructor(client, guild) {
        this.#client = client;

        this.id = guild.id;
        this.name = guild.name;
        this.icon = guild.icon;
        this.iconHash = guild.icon_hash;
        this.splash = guild.splash;
        this.discoverySplash = guild.discovery_splash;
        this.ownerID = guild.owner_id;
        this.owner = null;
        this.me = null;

        this.permissions = guild.permissions;

        this.region = guild.region;
        this.afkChannelID = guild.afk_channel_id;
        this.afkTimeout = guild.afk_timeout;
        this.widgetEnabled = guild.widget_enabled;
        this.widgetChannelID = guild.widget_channel_id;
        this.verificationLevel = guild.verification_level;
        this.defaultMessageNotifications = guild.default_message_notifications;
        
        this.explicitContentFilter = guild.explicit_content_filter;
        this.roles = new GuildRoleHelper(guild, client);
    }

    async init() {
        this.owner = await this.#client.users.get(this.ownerID);
        this.me = await this.#client.users.get(this.#client.user.id);
    }

    get createdAt() {
        return new Date(this.id / 4194304 + 1420070400000);
    }

    get createdTimestamp() {
        return this.createdAt.getTime();
    }

    get deleted() {
        // Can't use cache.has because it could just be not cached
        // Using this will attempt to fetch it, discord will send null if it doesn't exist
        return this.#client.guilds.has(this.id);
    }

    get memberCount() {
        return this.members.size;
    }

    get available() {
        return this.deleted ? false : true;
    }

    get iconURL() {
        return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
    }

    get splashURL() {
        return this.splash ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png` : null;
    }

    get bannerURL() {
        return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png` : null;
    }

    get vanityURL() {
        return this.vanityURLCode ? `https://discord.gg/${this.vanityURLCode}` : null;
    }

}