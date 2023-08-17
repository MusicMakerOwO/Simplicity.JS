/*
GUILD_TEXT	0	a text channel within a server
DM	1	a direct message between users
GUILD_VOICE	2	a voice channel within a server
GROUP_DM	3	a direct message between multiple users
GUILD_CATEGORY	4	an organizational category that contains up to 50 channels
GUILD_ANNOUNCEMENT	5	a channel that users can follow and crosspost into their own server (formerly news channels)
ANNOUNCEMENT_THREAD	10	a temporary sub-channel within a GUILD_ANNOUNCEMENT channel
PUBLIC_THREAD	11	a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
PRIVATE_THREAD	12	a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
GUILD_STAGE_VOICE	13	a voice channel for hosting events with an audience
GUILD_DIRECTORY	14	the channel in a hub containing the listed servers
GUILD_FORUM	15	Channel that can only contain threads
GUILD_MEDIA	16	Channel that can only contain threads, similar to GUILD_FORUM channels
*/

module.exports = {
    GuildText: 0,
    TextChannel: 0,

    DirectMessage: 1,
    DM: 1,

    GuildVoice: 2,
    VoiceChannel: 2,
    VC: 2,

    GroupDM: 3,
    GroupDirectMessage: 3,

    GuildCategory: 4,
    Category: 4,

    GuildAnnouncement: 5,
    Announcement: 5,
    AnnouncementChannel: 5,

    AnnouncementThread: 10,
    Thread: 10,

    PublicThread: 11,
    
    PrivateThread: 12,

    GuildStageVoice: 13,
    GuildStage: 13,
    StageVoice: 13,
    Stage: 13,

    GuildDirectory: 14,
    Directory: 14,

    GuildForum: 15,
    Forum: 15,

    GuildMedia: 16,
    Media: 16
}
