const HTTPS = require('node:https')
const Logs = require('./Logs.js');


/*
await RegisterCommands(...commands, {
    token: 'token',
    clientID: 'id'
})
*/
module.exports = async function (...commands) {
    let options = commands.pop();

    if (commands.length === 0) throw new Error(`Must provide token and client ID when registering - RegisterCommands(commands, { token: 'token', clientID: 'id' })`)

    if (typeof options.clientID !== 'string') throw new Error('Client ID must be provided as a string')
    if (typeof options.token !== 'string') throw new Error('Bot token must be provided as a string')
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
        ? `https://discord.com/api/v10/applications/${options.clientID}/guilds/${options.guildID}/commands`
        : `https://discord.com/api/v10/applications/${options.clientID}/commands`

    
    commands = commands.map(c => typeof c.toJSON === 'function' ? c.toJSON() : c);

    let request = HTTPS.request(url, {
            headers: {
                "Authorization": `Bot ${options.token}`,
                "Content-Type": "application/json",
                "User-Agent": "DiscordBot (https://www.simplicityjs.dev/, v1.1.0)"
            },
            method: 'PUT'
        }, function (res) {

            // let data = '';
            //
            // res.on('data', chunk => data += chunk);
            //
            // res.on('end', () => {
            //     console.log(data)
            // });

            if (res.statusCode === 429) {
                return Logs.error(`You are being rate limited. Try again in ${res.headers['retry-after']} seconds`);
            }

            if (res.statusCode !== 200 && res.statusCode !== 201) {
                return Logs.error(`Hmm.. Seems Discord didn't like that. Status code: ${res.statusCode}`);
            }

        }
    );

    // exit after 10 secondes if no response
    request.setTimeout(10000, () => {
        request.destroy();
        Logs.error(`Request timed out after 10 seconds - Are you rate limited?`);
    });

    request.write(JSON.stringify(commands));

    request.end();

}