const Format = require('./Format.js');

const Guild = require('../Structures/Guild.js');
const Message = require('../Structures/Message.js');
const User = require('../Structures/User.js');

const Channel = require('../Structures/Channels/TextChannel.js');
const Member = require('../Structures/GuildData/Member.js');
const Role = require('../Structures/GuildData/Role.js');
const Emoji = require('../Structures/GuildData/Emoji.js');
const Sticker = require('../Structures/GuildData/Sticker.js');

const Ping = require('../Interactions/Ping.js');
const Command = require('../Interactions/Command.js');
const Button = require('../Interactions/Button.js');
const SelectMenu = require('../Interactions/SelectMenu.js');
const Modal = require('../Interactions/Modal.js');

const types = [
    { type: 'invalid', class: Object },
    { type: 'ping', class: Ping },
    { type: 'command', class: Command },
    { type: 'buttonClick', class: Button },
    { type: 'selectMenu', class: SelectMenu },
    { type: 'autocomplete', class: Object },
    { type: 'modalSubmit', class: Modal }
]

module.exports = async (client, event, data) => {
    switch (event) {
        case 'MESSAGE_CREATE':
            return client.emit('messageCreate', await Format.message(client, data));
        case 'GUILD_CREATE':
            this.client.guilds.set(data.id, data);
            return client.emit('guildCreate', await Format.guild(client, data));
        case 'INTERACTION_CREATE':
            // Discord is stupid and combines buttons and select menus into one type >:(
            if (data.type > 3) data.type++;
            if ('values' in data.data) data.type = 4;

            let interaction = types[data.type];
            if (!interaction) return;

            client.emit('interactionCreate', new interaction.class(data, client));
            client.emit(interaction.type, new interaction.class(data, client));
            return;
    }
}