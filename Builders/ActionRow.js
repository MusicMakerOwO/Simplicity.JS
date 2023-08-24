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
        this.maxSizeError = false;
    }
    
    addComponents(...components) {
        for (let component of components) {
            if (Array.isArray(component)) {
                this.addComponents(component);
            }

            if (this.components.length >= 5) {
                if (!this.maxSizeError) {
                    console.error( new Error('An action row can only have 5 components.').stack );
                    this.maxSizeError = true;
                }
                break;
            }

            if (this.components.length > 0) {
                if (this.components.some(c => c.type !== component.type)) {
                    console.error( new Error('You cannot mix component types in an action row.').stack );
                    continue;
                }
            }

            this.components.push(component);
        }

        return this;
    }

    addComponent(...components) {
        return this.addComponents(components);
    }


    setComponents(...components) {
        this.components = [];
        return this.addComponents(components);
    }

    setComponent(...components) {
        return this.setComponents(components);
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
                if (typeof component.toJSON !== 'function') {
                    throw new TypeError('Component must have a valid toJSON() method.');
                }

                data.components.push(component.toJSON());
            }
        }

        return data;

    }

    build() {
        return this.toJSON();
    }
}