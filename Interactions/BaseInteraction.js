const Message = require('../Structures/Message.js');
const Guild = require('../Structures/Guild.js');
const User = require('../Structures/User.js');
const Channel = require('../Structures/Channels/TextChannel.js');
const Member = require('../Structures/GuildData/Member.js');


let client = null;

module.exports = class BaseInteraction {
    constructor(interaction, _client) {
        console.log(interaction)

        client = _client;

        this.type = interaction.type;
        this.token = interaction.token;

        this.user = interaction.user
            ? new User(interaction.member?.user ?? interaction.user, client)
            : null;

        // this.message = interaction.message
        //     ? new Message(interaction.message, client)
        //     : null;

        // this.guild = interaction.guild
        //     ? new Guild(interaction.guild, client)
        //     : null;

        // this.channel = interaction.channel
        //     ? new Channel(interaction.channel, client)
        //     : null;

        // this.member = interaction.member
        //     ? new Member(interaction.member, client)
        //     : null;

        this.interactionID = interaction.id;
        this.version = interaction.version;
        this.applicationId = interaction.applicationId;

    }

    get isCommand() {
        return this.type === 2;
    }

    get isButton() {
        return this.type === 3;
    }

    get isSelectMenu() {
        return this.type === 3;
    }

    get isModal() {
        return this.type === 3;
    }

    get isPing() {
        return this.type === 1;
    }

    /*
    await interaction.reply({
        content: 'Hello world!',
        ephemeral: true
    });

    await interaction.reply({
        content: 'Hello world!',
        embeds: [embed],
        components: [button, dropDownMenu],
        ephemeral: true
    });

    await interaction.reply('Hello world!');
    */
    async reply(content) {
        let data = {};

        if (typeof content === 'string') {
            data.content = content;
        } else if (typeof content === 'object') {
            data = content;
        } else {
            throw new Error('Invalid content type');
        }

        data.ephemeral = data.ephemeral || false;

        if (data.embeds) {
            data.embeds = data.embeds.map(embed => typeof embed.toJSON === 'function' ? embed.toJSON() : embed);

            if (data.embeds.length > 10) {
                throw new Error('Embed limit exceeded');
            }
        }

        if (data.components) {
            data.components = data.components.map(component => typeof component.toJSON === 'function' ? component.toJSON() : component);

            if (data.components.length > 5) {
                throw new Error('Component limit exceeded');
            }
        }

        await client.API.post(`/interactions/${this.interactionID}/${this.token}/callback`, {
            type: 4,
            data
        });

    }

}