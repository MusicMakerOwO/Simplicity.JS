const Events = require('../Events.js');
const VoiceErrors = require('../Constants/VoiceErrors.js');
const VoiceOpCodes = require('../Constants/VoiceOPCodes.js');

module.exports = class VoiceClient extends Events {
    constructor(client) {
        super();

        this.client = client;
        this.userConnections = new Map();
        this.botConnections = new Map();

        this.client.on('raw', async (raw) => {
            let data = null;
            try {
                data = JSON.parse(raw);
            } catch {
                data = raw;
            }

            switch (data.t) {
                case 'VOICE_STATE_UPDATE':
                    if (data.d.channel_id) {
                        this.userConnections.set(data.d.user_id, {
                            guild: await this.client.guilds.get(data.d.guild_id),
                            channel: await this.client.channels.get(data.d.channel_id),
                            user: await this.client.users.get(data.d.user_id),
                            sessionID: data.d.session_id,
                            deaf: data.d.deaf,
                            mute: data.d.mute,
                            connectedSince: Date.now()
                        });
                        let voice = this.userConnections.get(data.d.user_id);
                        this.emit('debug', `User ${data.d.user_id} joined channel ${data.d.channel_id}`);
                        this.emit('userVoiceJoin', voice);
                    } else {
                        let voice = this.userConnections.get(data.d.user_id);
                        this.emit('debug', `User ${data.d.user_id} left channel`);
                        this.emit('userVoiceLeave', voice);
                        this.userConnections.delete(data.d.user_id);
                    }
                    break;
                case 'VOICE_SERVER_UPDATE':
                    this.botConnections.set(data.d.guild_id, {
                        token: data.d.token,
                        guild: await this.client.guilds.get(data.d.guild_id),
                        endpoint: data.d.endpoint
                    });

                    let botVoice = this.botConnections.get(data.d.guild_id);
                    this.emit('debug', `Bot joined channel ${data.d.guild_id}`);
                    this.emit('botVoiceJoin', botVoice);
                    break;
                default:
                    break;
            }
                
        });    
    }
    
    /*
    Don't need guild since channel IDs are already unique
    await client.voice.connect(channel, {
        mute?: boolean,
        deaf?: boolean,
    })
    */
    async connect(channel, options = {}) {
        if (!channel) throw new TypeError('No channel provided');
        switch (typeof channel) {
            case 'string':
                channel = await this.client.channels.get(channel);
                break;
            case 'object':
                channel = await this.client.channels.get(channel.id);
                break;
            default:
                throw new TypeError('Channel must either be a string or an object - Received: ' + typeof channel);
        }
        if (!channel) throw new Error('Channel not found');

        let guild = await this.client.guilds.get(channel);
        let voice = this.userConnections.get(this.client.user.id);

        if (voice) {
            if (voice.guild.id !== guild.id) throw new Error('Bot is already in a voice channel');
        }

        let data = {
            op: VoiceOpCodes.IDENTIFY,
            d: {
                server_id: guild.id,
                user_id: this.client.user.id,
                session_id: voice.sessionID,
                token: this.botConnections.get(guild.id).token
            }
        };

        this.emit('debug', `Connecting to voice channel ${channel}`);
        this.emit('debug', data);

        await this.client.API.sendWS(data);
    }


}