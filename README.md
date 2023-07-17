# Simplicity.JS

```
npm install @musicmaker/simplicity
```

```
const { Client } = require('@musicmaker/simplicity');

const client = new Client({
    token: "YOUR BOT TOKEN",
    intents: [
        "YOUR INTENTS HERE"
    ],
    maxCacheSize: 1000 // optional, default is 100
});


// client.on('raw', console.log);
// client.on('debug', console.log);
client.on('error', console.error);
client.on('warn', console.warn);

client.on('read', async (user) => {
    console.log('Logged in as ' + user.username);
    
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
        // No channel.send() yet! :(
        console.log('Pong!');
    }
    
    if (command === 'emojis') {
        // Array of all nitro emojis sent
        console.log( message.emojis );
    }
    
    /*
    message.guild = current guild
    message.channel = current channel
    */
});
```
