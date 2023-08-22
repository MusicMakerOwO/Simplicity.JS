const HTTPS = require('node:https')
const Logs = require('./Logs.js');


/*
await RegisterCommands(client.commands, {
    token: 'token',
    clientID: 'id'
})
*/
module.exports = async function (...commands) {
    let options = commands.pop();

    if (commands.length === 0) throw new Error(`Must provide token and client ID when registering - RegisterCommands(commands, { token: 'token', clientID: 'id' })`)

    if (!options.clientID) throw new Error('Client ID is required to register commands');
    if (!options.token) throw new Error('Bot token it required to register commands')
    if (options.guildID && typeof options.guildID !== 'string') throw new TypeError()

    // Convert any maps into arrays
    commands = commands.map(c => c instanceof Map ? [...c.values()] : c);

    // Combine into one array and remove any duplicates
    commands = commands.flat(Infinity);
    commands = [...new Set(commands)];

    // Sanity check lol
    if (!Array.isArray(commands)) throw new TypeError('Commands must be an array, received ' + typeof commands);
    if (commands.some(c => typeof c !== 'object')) throw new TypeError('Commands must only be objects or instance of the SlashCommand class');
    
    let nameList = [];
    for (let command of commands) {
        if (nameList.includes(command.name)) throw new TypeError(`Command name "${command.name}" is already taken`);
        nameList.push(command.name);
    }

    let url = options.guildID
        ? `https://disord.com/api/v11/applications/${options.clientID}/guilds/${options.guildID}/commands`
        : `https://disord.com/api/v11/applications/${options.clientID}/commands`

    
    commands = commands.map(c => c.toJSON ? c.toJSON() : c);

    console.log(commands)

    let request = HTTPS.request(url, {
            headers: {
                "Authorization": `Bot ${options.token}`,
                "Content-Type": "application/json"
            },
            method: 'PUT',
            body: JSON.stringify(commands)
        }, function (res) {
            let data = '';

            if (res.statusCode !== 200 && res.statusCode !== 201) {
                return Logs.error(`Hmm.. Seems Discord didn't like that. Status code: ${res.statusCode}`);
            }

            res.on('data', chunk => {
                data += chunk.toString();
            });

            res.on('end', () => {
                console.log( Buffer.from(data) );
                console.log(res.statusCode)
                try {
                    data = JSON.parse(data);
                    return data;
                } catch (error) {
                    console.log(error.stack);
                    Logs.error(`Something went wrong in registering the commands, contact the Simplicity support server!`);
                }
            });
        }
    );

    request.end();

}