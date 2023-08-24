const { SlashCommand, StringOption } = require('@musicmaker/simplicity');

module.exports = {
    data: new SlashCommand()
        .setName('say')
        .setDescription('Make the bot say something')
        .setOptions(
            new StringOption()
                .setName('message')
                .setDescription('The message to say')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        let message = interaction.getString('message');
        
        try {
            await interaction.channel.send(message);
        } catch (error) {
            await interaction.reply({
                content: 'I don\'t have permission to send messages in this channel!',
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            content: 'Message sent!',
            ephemeral: true
        });
        
    }
}