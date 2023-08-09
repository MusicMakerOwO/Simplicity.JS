# Simplicity.JS

```
npm install @musicmaker/simplicity
```

```
const { Client } = require('@musicmaker/simplicity');

const client = new Client({
    token: "YOUR BOT TOKEN",
    intents: [
        "YOUR",
        "INTENTS",
        "HERE"
    ],
    maxCacheSize: 1000 // optional, default is 100
});


// client.on('raw', console.log);
// client.on('debug', console.log);
client.on('error', console.error);
client.on('warn', console.warn);

client.on('read', async (user) => {
    console.log('Logged in as ' + user.username);

    await client.setStatus('dnd');
    await client.setStatusMessage('Playing', 'with Simplicity');

    const guild = await client.guilds.get("some guild id");
    const channel = await client.channels.get("some channel id");
    // ...
});


client.on('messageReate', async (message) => {
    console.log(message);

    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        await channel.send("Pong!");
    }
    
    if (command === 'emojis') {
        // Array of all nitro emojis sent
        console.log( message.emojis );
    }

    if (command === 'give-role') {
        await message.member.roles.add('1039866458366279710', '1011333547665133642');
        message.channel.send('Added roles');
    }

    if (command === 'remove-role') {
        await message.member.roles.remove('1039866458366279710');
        message.channel.send('Removed role');
    }

    if (command === 'member') {
        let member = await message.guild.members.random();
        message.channel.send(`Random member: <@${member.id}>`);
    }
});
```
