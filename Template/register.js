const fs = require('fs');
const { RegisterCommands } = require('@musicmaker/simplicity')

const commands = new Map();
const commandFiles = fs.readdirSync(`./commands`)
.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log(`\x1b[36mLoading command ${file}\x1b[0m`);
    try {
        const command = require(`./commands/${file}`);
        let cmd = command.data.toJSON();
        commands.set(cmd.name, command.data.toJSON());
    } catch (error) {
        console.log(`\x1b[31mError loading command ${file}\x1b[0m`);
        console.log(error.stack);
    }
}

RegisterCommands(commands, {
    token: 'YOUR TOKEN HERE',
    clientID: 'YOUR CLIENT ID HERE',
    
    // Want it for just one server? (global by default)
    // guildID: 'Your server ID here!'
});