const BaseOption = require('./BaseOption.js');
const ChannelTypes = require('../../Constants/ChannelTypes.js');

module.exports = class ChannelOption extends BaseOption {
    constructor() {
        super();
        this.type = 7;
        this.channel_types = [];
    }

    setChannelTypes(...channel_types) {
        for (const channel_type of channel_types) {
            if (Array.isArray(channel_type)) {
                return this.setChannelTypes(channel_type);
            }

            if (!ChannelTypes[channel_type]) {
                throw new Error(`Invalid channel type ${channel_type}`);
            }

            this.channel_types.push(channel_type);
        }

        return this;
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
        }
    }

}