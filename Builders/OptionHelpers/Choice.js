function ValidateOption(option, type) {
    if (typeof option !== 'string') {
        throw new Error(`Invalid choice ${type} - Must be a string`);
    }

    if (option.length < 1 || option.length > 100) {
        throw new Error(`Invalid choice ${type} - Must be between 1 and 100 characters in length`);
    }
}

module.exports = class Choice {
    constructor(name, value) {
        ValidateOption(name, 'name');
        if (value) ValidateOption(value, 'value');

        this.name = name;
        this.value = value ?? name.replace(/ +/g, '_')
    }

    toString() {
        return {
            name: this.name,
            value: this.value
        }
    }

    toJSON() {
        return this.toString();
    }
    
}