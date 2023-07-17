const Format = require('./Format.js');

module.exports = async (client, event, data) => {
    switch (event) {
        case 'MESSAGE_CREATE':
            return client.emit('messageCreate', await Format.message(client, data));
        case 'GUILD_CREATE':
            this.client.guilds.set(data.id, data);
            return client.emit('guildCreate', await Format.guild(client, data));
    }
}