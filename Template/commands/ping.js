const { SlashCommand } = require('@musicmaker/simplicity');

module.exports = {
    data: new SlashCommand()
        .setName('ping')
        .setDescription('Pong!'),
    async execute(interaction, client) {
        await interaction.reply('Pong!');
    }
}