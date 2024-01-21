const HTTPS = require('node:https')
const Logs = require('./Logs.js');


/*
await RegisterCommands(...commands, {
    token: 'token',
    clientID: 'id'
})
*/
module.exports = async function (commands, { token, clientID, guildID = null }) {

    if (typeof clientID !== 'string') throw new Error('Client ID must be provided as a string');
    if (typeof token !== 'string') throw new Error('Bot token must be provided as a string');
    if (guildID && typeof guildID !== 'string') throw new TypeError();

    commands.map(c => typeof c.toJSON === 'function' ? c.toJSON() : c);

    // Sanity check lol
    if (!Array.isArray(commands)) throw new TypeError('Commands must be an array, received ' + typeof commands);
    if (commands.some(c => typeof c !== 'object')) throw new TypeError('Commands must only be objects or instance of the SlashCommand class');

    console.log(commands);
    
    const nameList = [];
    for (const command of commands) {
        if (typeof command.name !== 'string') throw new TypeError(`Command name must be a string, received ${typeof command.name}`);
        if (nameList.includes(command.name)) throw new TypeError(`Command name "${command.name}" is already taken`);
        nameList.push(command.name);
    }

    const url = guildID
        ? `https://discord.com/api/v10/applications/${clientID}/guilds/${guildID}/commands`
        : `https://discord.com/api/v10/applications/${clientID}/commands`;

    const request = HTTPS.request(url, {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "DiscordBot (https://www.simplicityjs.dev/, v2.0.0)"
            },
            method: 'PUT'
        }, function (res) {

            if (res.statusCode === 429) {
                return Logs.error(`You are being rate limited. Try again in ${res.headers['retry-after']} seconds`);
            }

            if (res.statusCode !== 200 && res.statusCode !== 201) {
                return Logs.error(`Hmm.. Seems Discord didn't like that. Status code: ${res.statusCode}`);
            } else {
                Logs.debug(`Successfully registered ${commands.length} commands`);
                request.destroy();
            }

        }
    );

    
    request.write(JSON.stringify(commands));
    
    request.end();

    // exit after 10 secondes if no response
    request.setTimeout(10000, () => {
        request.destroy();
        Logs.error(`Request timed out after 10 seconds - Are you rate limited?`);
    });

}