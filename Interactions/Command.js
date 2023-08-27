const BaseInteraction = require('./BaseInteraction.js');
const InteractionOptions = require('../Helpers/InteractionOptions.js');

module.exports = class Command extends BaseInteraction {
    constructor (interaction, client) {
        super(interaction, client);

        this.name = interaction.data.name;
        this.id = interaction.data.id;

        this.options = new InteractionOptions(interaction.data.options);
    }
}