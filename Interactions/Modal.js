const BaseInteraction = require('./BaseInteraction');

module.exports = class Modal extends BaseInteraction {
    constructor (interaction, client) {
        super(interaction, client);

        this.customID = interaction.data.custom_id;
    }
}