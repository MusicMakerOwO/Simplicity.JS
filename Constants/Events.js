module.exports = {
    
    // ---------[ Client Events ]---------
    Ready: 'ready',
    Login: 'ready',


    // ---------[ Join/Leave Events ]---------
    GuildCreate: 'guildCreate',
    GuildJoin: 'guildCreate',
    ServerCreate: 'guildCreate',
    ServerJoin: 'guildCreate',

    GuildDelete: 'guildDelete',
    GuildLeave: 'guildDelete',
    ServerDelete: 'guildDelete',
    ServerLeave: 'guildDelete',



    // ---------[ Member Events ]---------
    GuildMemberAdd: 'guildMemberAdd',
    GuildMemberJoin: 'guildMemberAdd',
    GuildUserAdd: 'guildMemberAdd',
    GuildUserJoin: 'guildMemberAdd',
    ServerMemberAdd: 'guildMemberAdd',
    ServerMemberJoin: 'guildMemberAdd',
    ServerUserAdd: 'guildMemberAdd',
    ServerUserJoin: 'guildMemberAdd',
    MemberAdd: 'guildMemberAdd',
    MemberJoin: 'guildMemberAdd',
    UserAdd: 'guildMemberAdd',
    UserJoin: 'guildMemberAdd',

    GuildMemberRemove: 'guildMemberRemove',
    GuildMemberLeave: 'guildMemberRemove',
    GuildUserRemove: 'guildMemberRemove',
    GuildUserLeave: 'guildMemberRemove',
    ServerMemberRemove: 'guildMemberRemove',
    ServerMemberLeave: 'guildMemberRemove',
    ServerUserRemove: 'guildMemberRemove',
    ServerUserLeave: 'guildMemberRemove',
    MemberRemove: 'guildMemberRemove',
    MemberLeave: 'guildMemberRemove',
    UserRemove: 'guildMemberRemove',
    UserLeave: 'guildMemberRemove',

    GuildMemberUpdate: 'guildMemberUpdate',
    GuildUserUpdate: 'guildMemberUpdate',
    ServerMemberUpdate: 'guildMemberUpdate',
    ServerUserUpdate: 'guildMemberUpdate',
    MemberUpdate: 'guildMemberUpdate',
    UserUpdate: 'guildMemberUpdate',


    // ---------[ Role Events ]---------
    RoleCreate: 'roleCreate',
    RoleAdd: 'roleCreate',

    RoleDelete: 'roleDelete',
    RoleRemove: 'roleDelete',

    RoleUpdate: 'roleUpdate',
    RoleEdit: 'roleUpdate',


    // ---------[ Channel Events ]---------
    ChannelCreate: 'channelCreate',
    ChannelAdd: 'channelCreate',

    ChannelDelete: 'channelDelete',
    ChannelRemove: 'channelDelete',

    ChannelUpdate: 'channelUpdate',
    ChannelEdit: 'channelUpdate',


    // ---------[ Invite Events ]---------
    InviteCreate: 'inviteCreate',
    InviteAdd: 'inviteCreate',
    Invite: 'inviteCreate',

    InviteDelete: 'inviteDelete',
    InviteRemove: 'inviteDelete',

    InviteUpdate: 'inviteUpdate',
    InviteEdit: 'inviteUpdate',


    // ---------[ Ban Events ]---------
    GuildBanAdd: 'guildBanAdd',
    GuildMemberBan: 'guildBanAdd',
    GuildUserBan: 'guildBanAdd',
    ServerBanAdd: 'guildBanAdd',
    ServerMemberBan: 'guildBanAdd',
    ServerUserBan: 'guildBanAdd',
    BanAdd: 'guildBanAdd',
    MemberBan: 'guildBanAdd',
    UserBan: 'guildBanAdd',

    GuildBanRemove: 'guildBanRemove',
    GuildBanDelete: 'guildBanRemove',
    GuildMemberUnban: 'guildBanRemove',
    GuildUserUnban: 'guildBanRemove',
    ServerBanRemove: 'guildBanRemove',
    ServerBanDelete: 'guildBanRemove',
    ServerMemberUnban: 'guildBanRemove',
    ServerUserUnban: 'guildBanRemove',
    BanRemove: 'guildBanRemove',
    BanDelete: 'guildBanRemove',
    MemberUnban: 'guildBanRemove',
    UserUnban: 'guildBanRemove',

    GuildBanUpdate: 'guildBanUpdate',
    GuildBanEdit: 'guildBanUpdate',
    BanUpdate: 'guildBanUpdate',
    BanEdit: 'guildBanUpdate',
    

    // ---------[ Emoji Events ]---------
    EmojiCreate: 'emojiCreate',
    EmojiAdd: 'emojiCreate',
    
    EmojiDelete: 'emojiDelete',
    EmojiRemove: 'emojiDelete',

    EmojiUpdate: 'emojiUpdate',
    EmojiEdit: 'emojiUpdate',


    // ---------[ Sticker Events ]---------
    StickerCreate: 'stickerCreate',
    StickerAdd: 'stickerCreate',
    
    StickerDelete: 'stickerDelete',
    StickerRemove: 'stickerDelete',

    StickerUpdate: 'stickerUpdate',
    StickerEdit: 'stickerUpdate',


    // ---------[ Stage Events ]---------


    // ---------[ Thread Events ]---------


    // ---------[ Voice Events ]---------


    // ---------[ User Events ]---------


    // ---------[ Presence Events ]---------


    // ---------[ Typing Events ]---------


    // ---------[ Webhook Events ]---------


    // ---------[ Integration Events ]---------


    // ---------[ Interactions ]---------
    InteractionCreate: 'interactionCreate',
    Interaction: 'interactionCreate',

    ButtonClick: 'buttonClick',
    Button: 'buttonClick',

    SelectMenu: 'selectMenu',
    DropdownMenu: 'selectMenu',

    ModalSubmit: 'modalSubmit',
    Modal: 'modalSubmit',
    TextInput: 'modalSubmit',

    ContextMenu: 'contextMenu',
    Context: 'contextMenu',
    

    // ---------[ Messages ]---------
    MessageCreate: 'messageCreate',
    MessageSend: 'messageCreate',
    Message: 'messageCreate',

    MessageUpdate: 'messageUpdate',
    MessageEdit: 'messageUpdate',

    MessageDelete: 'messageDelete',
    MessageRemove: 'messageDelete',

    MessageDeleteBulk: 'messageDeleteBulk',
    MessageRemoveBulk: 'messageDeleteBulk',
    MessageBulkDelete: 'messageDeleteBulk',
    MessageBulkRemove: 'messageDeleteBulk',
    MessagePurge: 'messageDeleteBulk',


    // ---------[ Message Reactions ]---------
    MessageReactionAdd: 'messageReactionAdd',
    MessageReaction: 'messageReactionAdd',
    ReactionAdd: 'messageReactionAdd',

    MessageReactionRemove: 'messageReactionRemove',
    ReactionRemove: 'messageReactionRemove',

    MessageReactionRemoveAll: 'messageReactionRemoveAll',
    ReactionRemoveAll: 'messageReactionRemoveAll',
    RemoveAllReactions: 'messageReactionRemoveAll',
    RemoveReactions: 'messageReactionRemoveAll',

    MessageReactionRemoveEmoji: 'messageReactionRemoveEmoji',
    ReactionRemoveEmoji: 'messageReactionRemoveEmoji',
    RemoveReactionEmoji: 'messageReactionRemoveEmoji'
}