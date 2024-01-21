const BaseOption = require('./BaseOption.js');

module.exports = class BooleanOption extends BaseOption {
    constructor() {
        super();
        this.type = 5;
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