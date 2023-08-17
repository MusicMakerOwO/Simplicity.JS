const IntegerOption = require("./IntegerOption");

module.exports = class FloatOption extends IntegerOption {
    constructor() {
        super();
        this.type = 10;
    }

    // It's literally the exact same but supports decimals ._.

}