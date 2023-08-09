// https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes

module.exports = {
    0: 'DISPATCH',
    1: 'HEARTBEAT',
    2: 'IDENTIFY',
    3: 'PRESENCE_UPDATE',
    4: 'VOICE_STATE_UPDATE',
    6: 'RESUME',
    7: 'RECONNECT',
    8: 'REQUEST_GUILD_MEMBERS',
    9: 'INVALID_SESSION',
    10: 'HELLO',
    11: 'HEARTBEAT_ACK',
    
    'DISPATCH': 0,
    'HEARTBEAT': 1,
    'IDENTIFY': 2,
    'PRESENCE_UPDATE': 3,
    'VOICE_STATE_UPDATE': 4,
    'RESUME': 6,
    'RECONNECT': 7,
    'REQUEST_GUILD_MEMBERS': 8,
    'INVALID_SESSION': 9,
    'HELLO': 10,
    'HEARTBEAT_ACK': 11
}