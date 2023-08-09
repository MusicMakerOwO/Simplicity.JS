module.exports = {
    raw: 'raw',
    debug: 'debug',
    error: 'error',
    warn: 'warn',
    warning: 'warn',

    ready: 'ready',
    heartbeat: 'heartbeat',
    tick: 'heartbeat',
    disconnect: 'disconnect',
    reconnect: 'reconnect',
    resume: 'resume',
    rateLimit: 'rateLimit',

    message: 'messageCreate',
    messageSend: 'messageCreate',
    messageCreate: 'messageCreate',
    messageDelete: 'messageDelete',
    messageUpdate: 'messageUpdate',

    serverCreate: 'guildCreate',
    serverJoin: 'guildCreate',
    guildCreate: 'guildCreate',

    serverDelete: 'guildDelete',
    serverLeave: 'guildDelete',
    guildDelete: 'guildDelete',

    serverUpdate: 'guildUpdate',
    serverEdit: 'guildUpdate',
    guildUpdate: 'guildUpdate',

    userJoin: 'guildMemberAdd',
    memberJoin: 'guildMemberAdd',
    guildMemberAdd: 'guildMemberAdd',
    
    userLeave: 'guildMemberRemove',
    memberLeave: 'guildMemberRemove',
    guildMemberRemove: 'guildMemberRemove',
    
    userUpdate: 'guildMemberUpdate',
    memberUpdate: 'guildMemberUpdate',
    guildMemberUpdate: 'guildMemberUpdate',

    channelCreate: 'channelCreate',
    channelDelete: 'channelDelete',
    channelUpdate: 'channelUpdate',

    userVoiceJoin: 'userVoiceJoin',
    memberVoiceJoin: 'userVoiceJoin',
    userVoiceLeave: 'userVoiceLeave',
    memberVoiceLeave: 'userVoiceLeave'
};

/*
module.exports = [
    'raw',
    'debug',
    'error',
    'warn',

    'ready',
    'heartbeat',
    'disconnect',
    'reconnect',
    'resume',
    'rateLimit',

    'message',
    'messageCreate',
    'messageDelete',
    'messageUpdate',

    'guildCreate',
    'guildDelete',
    'guildUpdate',

    'userJoin',
    'userLeave',
    'userUpdate',

    'guildMemberAdd',
    'guildMemberRemove',
    'guildMemberUpdate',

    'channelCreate',
    'channelDelete',
    'channelUpdate'
];
*/