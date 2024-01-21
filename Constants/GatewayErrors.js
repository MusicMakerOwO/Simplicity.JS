/*
4000	Unknown error	We're not sure what went wrong. Try reconnecting?	true
4001	Unknown opcode	You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!	true
4002	Decode error	You sent an invalid payload to Discord. Don't do that!	true
4003	Not authenticated	You sent us a payload prior to identifying.	true
4004	Authentication failed	The account token sent with your identify payload is incorrect.	false
4005	Already authenticated	You sent more than one identify payload. Don't do that!	true
4007	Invalid seq	The sequence sent when resuming the session was invalid. Reconnect and start a new session.	true
4008	Rate limited	Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this.	true
4009	Session timed out	Your session timed out. Reconnect and start a new one.	true
4010	Invalid shard	You sent us an invalid shard when identifying.	false
4011	Sharding required	The session would have handled too many guilds - you are required to shard your connection in order to connect.	false
4012	Invalid API version	You sent an invalid version for the gateway.	false
4013	Invalid intent(s)	You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.	false
4014	Disallowed intent(s)	You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not approved for.	false
*/

module.exports = {
    'null': {
        title: 'Unknown error (null)',
        message: 'Something went wrong and we aren\'t sure what. Try reconnecting?',
        reconnect: true,
    },
    4000: {
        title: 'Unknown error',
        message: "Something went wrong on Discord's end. Try reconnecting?",
        reconnect: true,
    },
    4001: {
        title: 'Unknown opcode',
        message: "Discord has terminated this connection with 4001.\nIf you see this, please report it to the Simplicity Support server.",
        reconnect: false,
    },
    4002: {
        title: 'Decode error',
        message: 'You sent an invalid payload to Discord. Don\'t do that!',
        reconnect: false,
    },
    4003: {
        title: 'Not authenticated',
        message: 'Wait to connect before you try to use the bot!',
        reconnect: false,
    },
    4004: {
        title: 'Authentication failed',
        message: 'Your token is invalid, please check you have set it corretly and try again',
        reconnect: false,
    },
    4005: {
        title: 'Already authenticated',
        message: 'You tried to login twice, how do you expect that to work?',
        reconnect: false,
    },
    4007: {
        title: 'Invalid seq',
        message: 'Invalid sequence, please reconnect and try again - Report this to the Simplicity Support server if it continues!',
        reconnect: false,
    },
    4008: {
        title: 'Rate limited',
        message: 'You got rate limited, come back in a few hours!',
        reconnect: false,
    },
    4009: {
        title: 'Session timed out',
        message: 'Your session timed out, please reconnect and try again!',
        reconnect: true,
    },
    4010: {
        title: 'Invalid shard',
        message: 'Invalid shard, please reconnect and try again - Report this to the Simplicity Support server if it continues!',
        reconnect: false,
    },
    4011: {
        title: 'Sharding required',
        message: 'Your bot is in more than 2,500 servers, sharding is required to connect due to Discord.',
        reconnect: false,
    },
    4012: {
        title: 'Invalid API version',
        message: 'Invalid API version - Report this to the Simplicity Support server if it continues!',
        reconnect: false,
    },
    4013: {
        title: 'Invalid intent(s)',
        message: 'Invalid intent(s) - I am impressed if you managed to get this one...',
        reconnect: false,
    },
    4014: {
        title: 'Disallowed intent(s)',
        message: 'It seems you are using intents that Discord has not allowed you to use.,\n(message content, guild members, or guild presence/status)',
        reconnect: false
    }
}