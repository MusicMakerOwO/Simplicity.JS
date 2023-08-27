const BaseInteraction = require('./BaseInteraction.js');

module.exports = class Button extends BaseInteraction {
    constructor (interaction, client) {
        super(interaction, client);

        this.customID = interaction.data.custom_id;
    }
}