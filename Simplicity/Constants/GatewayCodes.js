// https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes

module.exports = {
    4000: 'Unknown error',
    4001: 'Unknown opcode',
    4002: 'Decode error',
    4003: 'Not authenticated',
    4004: 'Authentication failed',
    4005: 'Already authenticated',
    4007: 'Invalid seq',
    4008: 'Rate limited',
    4009: 'Session timed out',
    4010: 'Invalid shard',
    4011: 'Sharding required',
    4012: 'Invalid API version',
    4013: 'Invalid intent(s)',
    4014: 'Disallowed intent(s)',
    
    'Unknown error': 4000,
    'Unknown opcode': 4001,
    'Decode error': 4002,
    'Not authenticated': 4003,
    'Authentication failed': 4004,
    'Already authenticated': 4005,
    'Invalid seq': 4007,
    'Rate limited': 4008,
    'Session timed out': 4009,
    'Invalid shard': 4010,
    'Sharding required': 4011,
    'Invalid API version': 4012,
    'Invalid intent(s)': 4013,
    'Disallowed intent(s)': 4014
}