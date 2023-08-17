/*CREATE_INSTANT_INVITE	0x0000000000000001 (1 << 0)	Allows creation of instant invites	T, V, S
KICK_MEMBERS *	0x0000000000000002 (1 << 1)	Allows kicking members	
BAN_MEMBERS *	0x0000000000000004 (1 << 2)	Allows banning members	
ADMINISTRATOR *	0x0000000000000008 (1 << 3)	Allows all permissions and bypasses channel permission overwrites	
MANAGE_CHANNELS *	0x0000000000000010 (1 << 4)	Allows management and editing of channels	T, V, S
MANAGE_GUILD *	0x0000000000000020 (1 << 5)	Allows management and editing of the guild	
ADD_REACTIONS	0x0000000000000040 (1 << 6)	Allows for the addition of reactions to messages	T, V, S
VIEW_AUDIT_LOG	0x0000000000000080 (1 << 7)	Allows for viewing of audit logs	
PRIORITY_SPEAKER	0x0000000000000100 (1 << 8)	Allows for using priority speaker in a voice channel	V
STREAM	0x0000000000000200 (1 << 9)	Allows the user to go live	V, S
VIEW_CHANNEL	0x0000000000000400 (1 << 10)	Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels	T, V, S
SEND_MESSAGES	0x0000000000000800 (1 << 11)	Allows for sending messages in a channel and creating threads in a forum (does not allow sending messages in threads)	T, V, S
SEND_TTS_MESSAGES	0x0000000000001000 (1 << 12)	Allows for sending of /tts messages	T, V, S
MANAGE_MESSAGES *	0x0000000000002000 (1 << 13)	Allows for deletion of other users messages	T, V, S
EMBED_LINKS	0x0000000000004000 (1 << 14)	Links sent by users with this permission will be auto-embedded	T, V, S
ATTACH_FILES	0x0000000000008000 (1 << 15)	Allows for uploading images and files	T, V, S
READ_MESSAGE_HISTORY	0x0000000000010000 (1 << 16)	Allows for reading of message history	T, V, S
MENTION_EVERYONE	0x0000000000020000 (1 << 17)	Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel	T, V, S
USE_EXTERNAL_EMOJIS	0x0000000000040000 (1 << 18)	Allows the usage of custom emojis from other servers	T, V, S
VIEW_GUILD_INSIGHTS	0x0000000000080000 (1 << 19)	Allows for viewing guild insights	
CONNECT	0x0000000000100000 (1 << 20)	Allows for joining of a voice channel	V, S
SPEAK	0x0000000000200000 (1 << 21)	Allows for speaking in a voice channel	V
MUTE_MEMBERS	0x0000000000400000 (1 << 22)	Allows for muting members in a voice channel	V, S
DEAFEN_MEMBERS	0x0000000000800000 (1 << 23)	Allows for deafening of members in a voice channel	V
MOVE_MEMBERS	0x0000000001000000 (1 << 24)	Allows for moving of members between voice channels	V, S
USE_VAD	0x0000000002000000 (1 << 25)	Allows for using voice-activity-detection in a voice channel	V
CHANGE_NICKNAME	0x0000000004000000 (1 << 26)	Allows for modification of own nickname	
MANAGE_NICKNAMES	0x0000000008000000 (1 << 27)	Allows for modification of other users nicknames	
MANAGE_ROLES *	0x0000000010000000 (1 << 28)	Allows management and editing of roles	T, V, S
MANAGE_WEBHOOKS *	0x0000000020000000 (1 << 29)	Allows management and editing of webhooks	T, V, S
MANAGE_GUILD_EXPRESSIONS *	0x0000000040000000 (1 << 30)	Allows management and editing of emojis, stickers, and soundboard sounds	
USE_APPLICATION_COMMANDS	0x0000000080000000 (1 << 31)	Allows members to use application commands, including slash commands and context menu commands.	T, V, S
REQUEST_TO_SPEAK	0x0000000100000000 (1 << 32)	Allows for requesting to speak in stage channels. (This permission is under active development and may be changed or removed.)	S
MANAGE_EVENTS	0x0000000200000000 (1 << 33)	Allows for creating, editing, and deleting scheduled events	V, S
MANAGE_THREADS *	0x0000000400000000 (1 << 34)	Allows for deleting and archiving threads, and viewing all private threads	T
CREATE_PUBLIC_THREADS	0x0000000800000000 (1 << 35)	Allows for creating public and announcement threads	T
CREATE_PRIVATE_THREADS	0x0000001000000000 (1 << 36)	Allows for creating private threads	T
USE_EXTERNAL_STICKERS	0x0000002000000000 (1 << 37)	Allows the usage of custom stickers from other servers	T, V, S
SEND_MESSAGES_IN_THREADS	0x0000004000000000 (1 << 38)	Allows for sending messages in threads	T
USE_EMBEDDED_ACTIVITIES	0x0000008000000000 (1 << 39)	Allows for using Activities (applications with the EMBEDDED flag) in a voice channel	V
MODERATE_MEMBERS **	0x0000010000000000 (1 << 40)	Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels	
VIEW_CREATOR_MONETIZATION_ANALYTICS *	0x0000020000000000 (1 << 41)	Allows for viewing role subscription insights	
USE_SOUNDBOARD	0x0000040000000000 (1 << 42)	Allows for using soundboard in a voice channel	V
USE_EXTERNAL_SOUNDS	0x0000200000000000 (1 << 45)	Allows the usage of custom soundboard sounds from other servers	V
SEND_VOICE_MESSAGES	0x0000400000000000 (1 << 46)	Allows sending voice message*/

module.exports = {
    CreateInstantInvite: 1 << 0,
    CreateInvite: 1 << 0,
    InstantInvite: 1 << 0,

    KickMembers: 1 << 1,
    KickUsers: 1 << 1,
    Kick: 1 << 1,

    BanMembers: 1 << 2,
    BanUsers: 1 << 2,
    Ban: 1 << 2,

    Administrator: 1 << 3,
    Admin: 1 << 3,

    ManageChannels: 1 << 4,
    EditChannels: 1 << 4,
    CreateChannels: 1 << 4,
    DeleteChannels: 1 << 4,
    ManageChannel: 1 << 4,
    EditChannel: 1 << 4,
    CreateChannel: 1 << 4,
    DeleteChannel: 1 << 4,

    ManageGuild: 1 << 5,
    EditGuild: 1 << 5,
    ManageServer: 1 << 5,
    EditServer: 1 << 5,

    AddReactions: 1 << 6,
    React: 1 << 6,
    
    ViewAuditLog: 1 << 7,
    AuditLog: 1 << 7,
    ViewAudit: 1 << 7,

    PrioritySpeaker: 1 << 8,
    PriorityVoice: 1 << 8,

    Stream: 1 << 9,
    GoLive: 1 << 9,
    ShareScreen: 1 << 9,

    ViewChannel: 1 << 10,
    ReadChannel: 1 << 10,

    SendMessages: 1 << 11,

    SendTTSMessage: 1 << 12,
    SendTTS: 1 << 12,
    TTSMessage: 1 << 12,
    TTS: 1 << 12,

    ManageMessages: 1 << 13,
    EditMessages: 1 << 13,
    DeleteMessages: 1 << 13,
    PinMessages: 1 << 13,

    EmbedLinks: 1 << 14,
    Embed: 1 << 14,
    SendGif: 1 << 14,
    SendGifs: 1 << 14,
    
    AttachFiles: 1 << 15,
    SendFiles: 1 << 15,
    SendAttachments: 1 << 15,
    SendImages: 1 << 15,
    SendPictures: 1 << 15,

    ReadMessageHistory: 1 << 16,
    ReadHistory: 1 << 16,
    ViewHistory: 1 << 16,
    MessageHistory: 1 << 16,

    MentionEveryone: 1 << 17,
    MentionHere: 1 << 17,
    MentionAll: 1 << 17,

    UseExternalEmojis: 1 << 18,
    ExternalEmojis: 1 << 18,

    ViewGuildInsights: 1 << 19,
    ViewInsights: 1 << 19,
    Insights: 1 << 19,

    Connect: 1 << 20,
    JoinVoice: 1 << 20,
    JoinVoiceChannel: 1 << 20,
    JoinVoiceChat: 1 << 20,
    JoinVC: 1 << 20,

    Speak: 1 << 21,
    SpeakInVoice: 1 << 21,
    SpeakInVoiceChannel: 1 << 21,
    SpeakInVoiceChat: 1 << 21,
    SpeakInVC: 1 << 21,

    MuteMembersVoice: 1 << 22,
    MuteMembersVoiceChat: 1 << 22,
    MuteMembersVoiceChannel: 1 << 22,
    MuteMembersVC: 1 << 22,

    DeafenMembersVoice: 1 << 23,
    DeafenMembersVoiceChat: 1 << 23,
    DeafenMembersVoiceChannel: 1 << 23,
    DeafenMembersVC: 1 << 23,

    MoveMembersVoice: 1 << 24,
    MoveMembersVoiceChat: 1 << 24,
    MoveMembersVoiceChannel: 1 << 24,
    MoveMembersVC: 1 << 24,

    UseVoiceActivityDetection: 1 << 25,
    UseVAD: 1 << 25,
    VAD: 1 << 25,

    ChangeNickname: 1 << 26,
    ChangeNick: 1 << 26,
    Nickname: 1 << 26,
    Nick: 1 << 26,

    ManageNicknames: 1 << 27,
    ManageNicks: 1 << 27,
    EditNicknames: 1 << 27,
    EditNicks: 1 << 27,
    
    ManageRoles: 1 << 28,
    EditRoles: 1 << 28,
    CreateRoles: 1 << 28,
    DeleteRoles: 1 << 28,
    
    ManageWebhooks: 1 << 29,
    EditWebhooks: 1 << 29,
    CreateWebhooks: 1 << 29,
    DeleteWebhooks: 1 << 29,

    ManageGuildExpressions: 1 << 30,
    EditGuildExpressions: 1 << 30,
    CreateGuildExpressions: 1 << 30,
    DeleteGuildExpressions: 1 << 30,
    CreateAutomod: 1 << 30,
    ManageAutomod: 1 << 30,
    EditAutomod: 1 << 30,
    DeleteAutomod: 1 << 30,

    UseApplicationCommands: 1 << 31,
    UseSlashCommands: 1 << 31,
    UseSlash: 1 << 31,
    UseBotCommands: 1 << 31,
    UseCommands: 1 << 31,

    RequestToSpeak: 1 << 32,

    ManageEvents: 1 << 33,
    EditEvents: 1 << 33,
    CreateEvents: 1 << 33,
    DeleteEvents: 1 << 33,

    ManageThreads: 1 << 34,
    EditThreads: 1 << 34,
    CreateThreads: 1 << 34,
    DeleteThreads: 1 << 34,

    CreatePublicThreads: 1 << 35,
    CreateAnnouncementThreads: 1 << 35,
    PublicThreads: 1 << 35,
    AnnouncementThreads: 1 << 35,

    CreatePrivateThreads: 1 << 36,
    PrivateThreads: 1 << 36,

    UseExternalStickers: 1 << 37,
    ExternalStickers: 1 << 37,

    SendMessagesInThreads: 1 << 38,
    
    UseEmbeddedActivities: 1 << 39,
    UseActivities: 1 << 39,
    StartVoiceActivity: 1 << 39,

    ModerateMembers: 1 << 40,
    ModerateUsers: 1 << 40,
    TimeoutMembers: 1 << 40,
    TimeoutUsers: 1 << 40,
    Timeout: 1 << 40,

    ViewCreatorMonetizationAnalytics: 1 << 41,
    ViewMonetizationAnalytics: 1 << 41,
    ViewAnalytics: 1 << 41,
    ViewMonetization: 1 << 41,
    ViewCreatorAnalytics: 1 << 41,

    UseSoundboard: 1 << 42,

    UseExternalSounds: 1 << 45,
    ExternalSounds: 1 << 45,

    SendVoiceMessages: 1 << 46,
    VoiceMessages: 1 << 46,

    // 2^46 - 1
    All: 0x7FFFFFFFFFFFF,
    AllPermissions: 0x7FFFFFFFFFFFF,
    AllPerms: 0x7FFFFFFFFFFFF,

}