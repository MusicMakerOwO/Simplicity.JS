const BaseOption = require('./BaseOption.js');

module.exports = class MentionableOption extends BaseOption {
    constructor() {
        super();
        this.type = 9;
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