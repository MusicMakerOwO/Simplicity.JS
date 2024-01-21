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
    None: 0n,

    createInvite: 1n << 0n,
    kickMembers: 1n << 1n,
    banMembers: 1n << 2n,
    admin: 1n << 3n,
    manageChannels: 1n << 4n,
    manageGuild: 1n << 5n,
    addReactions: 1n << 6n,
    viewAuditLog: 1n << 7n,
    prioritySpeaker: 1n << 8n,
    stream: 1n << 9n,
    viewChannel: 1n << 10n,
    sendMessages: 1n << 11n,
    sendTTS: 1n << 12n,
    manageMessages: 1n << 13n,
    embedLinks: 1n << 14n,
    attachFiles: 1n << 15n,
    readMessageHistory: 1n << 16n,
    mentionEveryone: 1n << 17n,
    useExternalEmojis: 1n << 18n,
    viewGuildInsights: 1n << 19n,
    connect: 1n << 20n,
    speak: 1n << 21n,
    muteMembers: 1n << 22n,
    deafenMembers: 1n << 23n,
    moveMembers: 1n << 24n,
    useVAD: 1n << 25n,
    changeNickname: 1n << 26n,
    manageNicknames: 1n << 27n,
    manageRoles: 1n << 28n,
    manageWebhooks: 1n << 29n,
    manageGuildExpressions: 1n << 30n,
    useApplicationCommands: 1n << 31n,
    requestToSpeak: 1n << 32n,
    manageEvents: 1n << 33n,
    manageThreads: 1n << 34n,
    createPublicThreads: 1n << 35n,
    createPrivateThreads: 1n << 36n,
    useExternalStickers: 1n << 37n,
    sendMessagesInThreads: 1n << 38n,
    useEmbeddedActivities: 1n << 39n,
    muteMembers: 1n << 40n,
    viewCreatorMonetizationAnalytics: 1n << 41n,
    useSoundboard: 1n << 42n,
    useExternalSounds: 1n << 45n,
    sendVoiceMessages: 1n << 46n,


    // 2^46 - 1
    All: 0x7FFFFFFFFFFFFn

}