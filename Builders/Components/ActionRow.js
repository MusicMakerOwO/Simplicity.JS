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
        for (const component of components) {
            if (Array.isArray(component)) {
                this.addComponents(...component);
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
        return this.addComponents(...components);
    }

    toJSON() {
        return {
            type: this.type,
            components: this.components.map(c => typeof c.toJSON === 'function' ? c.toJSON() : c)
        }
    }
}