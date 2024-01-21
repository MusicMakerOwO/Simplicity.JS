module.exports = class InteractionOptions extends Array {
    constructor (options) {
        super();
        this.push(...options ?? []);
    }

    get (name, type) {

        if (typeof name === 'number') {
            type = name;
            name = undefined;
        }

        if (typeof name !== 'string') throw new Error('Invalid option lookup - Name must be a string');
        if (type && typeof type !== 'number') throw new Error('Invalid option lookup - Type must be a number');

        /*
          options: InteractionOptions(1) [
            { value: 'hello', type: 3, name: 'message' }
        ]
        */
        if (!type) {
            return this.find(o => o.name === name)?.value;
        }

        return this.find(o => o.name === name && o.type === type)?.value;
    }

    getSubcommand() {
        return this.get(1);
    }
    
    getSubcommandGroup() {
        return this.get(2)
    }

    getGroup() {
        return this.getSubcommandGroup();
    }

    getString(name) {
        return this.get(name, 3);
    }

    getInteger(name) {
        return this.get(name, 4);
    }

    getBoolean(name) {
        return this.get(name, 5);
    }
    
    getUser(name) {
        return this.get(name, 6);
    }

    getChannel(name) {
        return this.get(name, 7);
    }

    getRole(name) {
        return this.get(name, 8);
    }

    getMentionable(name) {
        return this.get(name, 9);
    }

    getNumber(name) {
        return this.get(name, 10);
    }

    getFloat(name) {
        return this.getNumber(name);
    }

}