const BaseOption = require('./BaseOption.js');

module.exports = class UserOption extends BaseOption {
    constructor() {
        super();
        this.type = 6;
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
        }
    }

    build() {
        return this.toJSON();
    }

}