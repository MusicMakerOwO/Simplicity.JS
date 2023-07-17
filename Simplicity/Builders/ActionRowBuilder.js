/*
{
    type: 1,
    components: []
}
*/

module.exports = class ActionRowBuilder {
    constructor() {
        this.type = 1;
        this.components = [];
    }

    addComponent(component) {
        if (this.components.length === 5) throw new Error('An action row can only have 5 components.');

        // Make sure you aren't mixing component types
        if (this.components.length > 0) {
            if (this.components.some(c => c.type !== component.type)) throw new Error('You cannot mix component types in an action row.');
        }

        this.components.push(component);
        return this;
    }

    addComponents(...components) {
        for (let component of components) {
            this.addComponent(component);
        }
        return this;
    }

    setComponents(...components) {
        this.components = [];
        for (let component of components) {
            this.addComponent(component);
        }
    }

    toJSON() {
        let data = {
            type: this.type,
            components: []
        }

        for (let component of this.components) {
            // Test if it is a class or an object
            if (component.constructor.name === 'Object') {
                data.components.push(component);
            } else {
                data.components.push(component.toJSON());
            }
        }

        return data;

    }
}