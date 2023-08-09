/*
https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice

4001	Unknown opcode	You sent an invalid opcode.
4002	Failed to decode payload	You sent an invalid payload in your identifying to the Gateway.
4003	Not authenticated	You sent a payload before identifying with the Gateway.
4004	Authentication failed	The token you sent in your identify payload is incorrect.
4005	Already authenticated	You sent more than one identify payload. Stahp.
4006	Session no longer valid	Your session is no longer valid.
4009	Session timeout	Your session has timed out.
4011	Server not found	We can't find the server you're trying to connect to.
4012	Unknown protocol	We didn't recognize the protocol you sent.
4014	Disconnected	Channel was deleted, you were kicked, voice server changed, or the main gateway session was dropped. Should not reconnect.
4015	Voice server crashed	The server crashed. Our bad! Try resuming.
4016	Unknown encryption mode	We didn't recognize your encryption.
*/


module.exports = {
    4001: 'You sent an invalid opcode - Report this to the Simplicity Support server if it continues!',
    4002: 'Failed to decode payload, oops!',
    4003: 'You aren\'t logged in, please login and try again!',
    4004: 'Your token is invalid, please check you have set it corretly and try again',
    4005: 'You tried to login twice, how do you expect that to work?',
    4006: 'Your session is no longer valid, please reconnect and try again!',
    4009: 'Your session timed out, this is often due to bad internet.',
    4011: 'We can\'t find the server you\'re trying to connect to, please check the ID and try again!',
    4012: 'We didn\'t recognize the protocol you sent - Report this to the Simplicity Support server if it continues!',
    4014: 'You were disconnected for some reason, this was Discord\'s doing.',
    4015: 'The voice server crashed, how did you manage that one? o_o',
    4016: 'We didn\'t recognize your encryption - Report this to the Simplicity Support server if it continues!'
}