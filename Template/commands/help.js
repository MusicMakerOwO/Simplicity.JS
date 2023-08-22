const { SlashCommand, Embed} = require('@musicmaker/simplicity');

module.exports = {
    data: new SlashCommand()
        .setName('help')
        .setDescription('View a list of all slash commands'),
    async execute(interaction, client) {

        const commands = client.commands.map(c => `**/${c.name}** - ${c.description}` ).join('\n')

        const helpEmbed = new Embed()
            .setDescription(commands)
            .setFooter(`${client.user.tag} | ${interaction.guild.name}`)
            .setTimestamp()

        await interaction.reply({
            embeds: [helpEmbed]
        });
        
    }
}