/*
https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice

0	Identify	client	Begin a voice websocket connection.
1	Select Protocol	client	Select the voice protocol.
2	Ready	server	Complete the websocket handshake.
3	Heartbeat	client	Keep the websocket connection alive.
4	Session Description	server	Describe the session.
5	Speaking	client and server	Indicate which users are speaking.
6	Heartbeat ACK	server	Sent to acknowledge a received client heartbeat.
7	Resume	client	Resume a connection.
8	Hello	server	Time to wait between sending heartbeats in milliseconds.
9	Resumed	server	Acknowledge a successful session resume.
13	Client Disconnect	server	A client has disconnected from the voice channel
*/

module.exports = {
    0: 'IDENTIFY',
    1: 'SELECT',
    2: 'READY',
    3: 'HEARTBEAT',
    4: 'SESSION_DESCRIPTION',
    5: 'SPEAKING',
    6: 'HEARTBEAT_ACK',
    7: 'RESUME',
    8: 'HELLO',
    9: 'RESUMED',
    13: 'CLIENT_DISCONNECT',

    'IDENTIFY': 0,
    'SELECT': 1,
    'READY': 2,
    'HEARTBEAT': 3,
    'SESSION_DESCRIPTION': 4,
    'SPEAKING': 5,
    'HEARTBEAT_ACK': 6,
    'RESUME': 7,
    'HELLO': 8,
    'RESUMED': 9,
    'CLIENT_DISCONNECT': 13
}