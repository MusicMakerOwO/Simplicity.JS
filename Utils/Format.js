const GuildMembers = require('../Helpers/GuildMembers.js');
const MemberRoles = require('../Helpers/MemberRoles.js');

module.exports = {
    message,
    guild,
    channel,
    member
}




async function message(client, msg) {
    /*
    msg: {
        type: 19,
        tts: false,
        timestamp: '2023-07-17T05:08:03.110000+00:00',
        referenced_message: {
            type: 0,
            tts: false,
            timestamp: '2023-07-17T05:06:36.903000+00:00',
            pinned: false,
            mentions: [],
            mention_roles: [],
            mention_everyone: false,
            id: '1130364915010502696',
            flags: 0,
            embeds: [],
            edited_timestamp: null,
            content: 'Yup, works now! Fuck me!',
            components: [],
            channel_id: '1087118874031427624',
            author: {
            username: 'musicmaker',
            public_flags: 4194432,
            id: '556949122003894296',
            global_name: 'Music Maker',
            discriminator: '0',
            avatar_decoration: null,
            avatar: '8ba71be929a8af0b7c43e5ee9948840b'
            },
            attachments: []
        },
        pinned: false,
        nonce: '1130365274826997760',
        message_reference: {
            message_id: '1130364915010502696',
            guild_id: '602329986463957025',
            channel_id: '1087118874031427624'
        },
        mentions: [
            {
            username: 'musicmaker',
            public_flags: 4194432,
            member: [Object],
            id: '556949122003894296',
            global_name: 'Music Maker',
            discriminator: '0',
            avatar_decoration: null,
            avatar: '8ba71be929a8af0b7c43e5ee9948840b'
            }
        ],
        mention_roles: [],
        mention_everyone: false,
        member: {
            roles: [],
            premium_since: null,
            pending: false,
            nick: null,
            mute: false,
            joined_at: '2023-07-17T00:16:01.839027+00:00',
            flags: 0,
            deaf: false,
            communication_disabled_until: null,
            avatar: null
        },
        id: '1130365276588867584',
        flags: 0,
        embeds: [],
        edited_timestamp: null,
        content: 'it be like that',
        components: [],
        channel_id: '1087118874031427624',
        author: {
            username: 'tempest0006',
            public_flags: 4194368,
            id: '538710870583410690',
            global_name: 'Tempest',
            discriminator: '0',
            avatar_decoration: null,
            avatar: 'b8de39c5b8b6d89977e7387e843210a0'
        },
        attachments: [],
        guild_id: '602329986463957025'
    }
    */

    msg.channel = await channel( client, await client.channels.get(msg.guild_id, msg.channel_id) );
    // msg.guild = await guild( client, await client.guilds.get(msg.guild_id) )
    // msg.member = await member( client, await client.members.get(msg.guild_id, msg.author.id), msg.guild_id );
    // msg.user = msg.author;
    // msg.author = await client.users.get(msg.author.id);

    msg.timestamp = new Date(msg.timestamp);
    if (msg.referenced_message) msg.referenced_message.timestamp = new Date(msg.referenced_message.timestamp);
    msg.member.joined_at = new Date(msg.member.joined_at);

    msg.author.avatarURL = `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.${msg.author.avatar.startsWith('a_') ? 'gif' : 'png'}?size=1024`;
    msg.author.tag = `${msg.author.username}#${msg.author.discriminator}`;


    msg.emojis = [];
    const emojis = msg.content?.match(/<(a?):([\w\d\-_]{2,}):(\d{17,})>/g) || [];
    for (const emoji of emojis) {
        const emojiData = emoji.slice(1, -1).split(':');

        let ID = emojiData.pop();
        let name = emojiData.pop();
        let animated = emojiData.pop() === 'a';

        msg.emojis.push({
            id: ID,
            name: name,
            animated: animated,
            url: `https://cdn.discordapp.com/emojis/${ID}.${animated ? 'gif' : 'png'}?size=1024`
        });
    }

    return msg;
}




async function guild (client, guild) {
    guild.members = new GuildMembers(client, guild, await client.members.get(guild.id));
    return guild;
}




async function channel (client, channel) {

    /*
    message.channel.send('Pong!');
    message.channel.send({ content: 'Pong!' });
    message.channel.send({ content: "Pong!", embeds: [embed] });
    */

    channel.send = async function (content) {
        switch (typeof content) {
            case 'string':
                return await client.API.post(`/channels/${channel.id}/messages`, { content });
            case 'object':
                
                for (const key in content) {
                    const items = content[key];
                    if (!Array.isArray(items)) continue;
                    
                    const updatedItems = [];
                    for (const item of items) {
                        if (typeof item?.build === 'function') {
                            const result = await item.build();
                            updatedItems.push(result);
                        }
                    }
                    
                    content[key] = updatedItems;
                }

                return await client.API.post(`/channels/${channel.id}/messages`, content);
            default:
                return await client.API.post(`/channels/${channel.id}/messages`, { content: `${content}` });
        }
    }

    return channel;

}



async function member (client, member, guildID) {
    let roles = [];
    for (const role of member.roles) {
        roles.push(await client.roles.get(role));
    }

    member.guildID = guildID;
    member.roles = new MemberRoles(roles, member, client);

    return member;
}