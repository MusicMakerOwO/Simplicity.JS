/*
GUILDS (1 << 0)
GUILD_MEMBERS (1 << 1)
GUILD_MODERATION (1 << 2)
GUILD_EMOJIS_AND_STICKERS (1 << 3)
GUILD_INTEGRATIONS (1 << 4)
GUILD_WEBHOOKS (1 << 5)
GUILD_INVITES (1 << 6)
GUILD_VOICE_STATES (1 << 7)
GUILD_PRESENCES (1 << 8)
GUILD_MESSAGES (1 << 9)
GUILD_MESSAGE_REACTIONS (1 << 10)
GUILD_MESSAGE_TYPING (1 << 11)
DIRECT_MESSAGES (1 << 12)
DIRECT_MESSAGE_REACTIONS (1 << 13)
DIRECT_MESSAGE_TYPING (1 << 14)
MESSAGE_CONTENT (1 << 15)
GUILD_SCHEDULED_EVENTS (1 << 16)
AUTO_MODERATION_CONFIGURATION (1 << 20)
AUTO_MODERATION_EXECUTION (1 << 21)
*/

module.exports = {
    Guilds: 1 << 0,

    GuildMembers: 1 << 1,
    Members: 1 << 1,

    GuildModeration: 1 << 2,
    GuildMute: 1 << 2,
    UserMute: 1 << 2,
    MemberMute: 1 << 2,
    Mute: 1 << 2,
    
    GuildEmojisAndStickers: 1 << 3,
    GuildStickers: 1 << 3,
    GuildEmojis: 1 << 3,
    Stickers: 1 << 3,
    Emojis: 1 << 3,

    GuildIntegrations: 1 << 4,
    Integrations: 1 << 4,

    GuildWebhooks: 1 << 5,
    Webhooks: 1 << 5,

    GuildInvites: 1 << 6,
    Invites: 1 << 6,

    GuildVoiceStates: 1 << 7,
    VoiceStates: 1 << 7,
    GuildVC: 1 << 7,
    GuildVoice: 1 << 7,
    Voice: 1 << 7,
    VC: 1 << 7,

    GuildPresences: 1 << 8,
    GuildStatus: 1 << 8,
    UserPressence: 1 << 8,
    UserStatus: 1 << 8,
    Presences: 1 << 8,
    Status: 1 << 8,

    GuildMessages: 1 << 9,
    Messages: 1 << 9,

    GuildMessageReactions: 1 << 10,
    MessageReactions: 1 << 10,
    Reactions: 1 << 10,

    GuildMessageTyping: 1 << 11,
    MessageTyping: 1 << 11,
    Typing: 1 << 11,

    DirectMessages: 1 << 12,
    DM: 1 << 12,

    DirectMessageReactions: 1 << 13,
    DMReactions: 1 << 13,

    DirectMessageTyping: 1 << 14,
    DMTyping: 1 << 14,

    MessageContent: 1 << 15,
    Content: 1 << 15,

    GuildScheduledEvents: 1 << 16,
    GuildEvents: 1 << 16,
    Events: 1 << 16,

    AutoModerationConfiguration: 1 << 20,
    AutoModConfig: 1 << 20,
    AutoMod: 1 << 20,

    AutoModerationExecution: 1 << 21,
    AutoModExecution: 1 << 21,
    AutoModExec: 1 << 21
};