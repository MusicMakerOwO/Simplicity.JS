const BaseOption = require('./BaseOption.js');

module.exports = class RoleOption extends BaseOption {
    constructor() {
        super();
        this.type = 8;
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