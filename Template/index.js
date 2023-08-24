const {
    Client,
    Log
} = require('@musicmaker/simplicity');
const fs = require('fs');


// Spawn the client, you login automatically :D
const client = new Client({
    token: "Put your bot token here",
    
    // only for slash commands
    clientID: "Put your bot client ID here"
});


// Load all the commands and register them
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (let file of commandFiles) {
    try {
        let command = require(`./commands/${file}`);
        let commandData = command.toJSON();
        client.commands.set(commandData.name, command);
    } catch (e) {
        console.error(e);
    }
}

// You only ever need to register commands, nothing else
client.registerCommands(client.commands);


// Hacker voice: I'm in
client.on('ready', async () => {
    Log.success(`Logged in as ${client.user.username}!`);

    await client.setStatus('idle');
    await client.setStatusMessage('😀 Welcome to Simplicity!');
    await client.setActivity('Listening to music...', 'https://twitch.tv/monstercat');
});



// woah so many things
const prefix = '!';
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content?.startsWith(prefix)) return;

    const args = message.content?.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    Log.info(`${message.author.username} (${message.author.id}) > ${prefix}${command}`);

    if (command === 'ping') {
        await message.channel.send('Pong!');
    }

    if (command === 'embed') {
        let embed = new Embed()
            .setTitle('Welcome to Simplicity!')
            .setDescription(`It's pretty cool, huh?`)
            .setColor('random')
            .setFooter('This is a footer')
            .setTimestamp();

        await message.channel.send(embed);
    }

    if (command === 'hello') {
        await message.channel.send('Welcome to simplicity!');
    }

});



// Basic command handling
client.on('command', async (interaction) => {

    Log.info(`${interaction.user.username} (${interaction.user.id}) > /${interaction.commandName}`);

    // Find the command in cache
    let command = client.commands.get(interaction.commandName);
    if (!command) {
        Log.error(`Unknown command "${interaction.commandName}"`);
        return;
    }

    // Run the command, this try/catch will stop your bot from crashing :D
    try {
        await command.execute(interaction, client);
    } catch (e) {
        Log.error(e);
    }
});



// Prefer the DJS interactionCreate? No problem!
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    // ...
});