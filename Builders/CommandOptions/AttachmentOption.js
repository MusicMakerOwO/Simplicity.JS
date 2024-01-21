const BaseOption = require('./BaseOption.js');

module.exports = class AttachmentOption extends BaseOption {
    constructor() {
        super();
        this.type = 11;
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