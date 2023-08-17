/*
const selectMenu = new SelectMenu()
    .setCustomId('select')
    .setPlaceholder('Select a color')
    .addOptions(
        {
            label: 'Red',
            name?: 'Red',
            value: 'red',
            description: 'This is a description',
            emoji: {
                name: '🟥',
            }
        },
        {
            label: 'Green',
            name?: 'Green',
            value: 'green',
            description: 'This is a description',
            emoji: '🟩',
        },
        new SelectMenuOption()
            .setLabel('Blue')
            .setName('Blue')
            .setValue('blue')
            .setDescription('This is a description')
            .setEmoji('🟦'),
    )
    .maxChoices(1);
    .minChoices(1);
*/

const SelectMenuOption = require('./SelectMenuOption');

module.exports = class SelectMenu {
    constructor() {
        this.data = {
            type: 3,
            custom_id: Math.random().toString(36).substring(2, 15),
            options: [],
            placeholder: '',
            min_values: 1,
            max_values: 1,
            disabled: false
        }
    }



    setCustomId(id) {
        if (typeof id !== 'string') throw new TypeError('Custom ID must be a string');
        if (id.length > 100) throw new RangeError('Custom ID must be less than 100 characters');
        this.data.custom_id = id;
        return this;
    }



    setPlaceholder(placeholder) {
        if (typeof placeholder !== 'string') throw new TypeError('Placeholder must be a string');
        if (placeholder.length > 100) throw new RangeError('Placeholder must be less than 100 characters');
        this.data.placeholder = placeholder;
        return this;
    }



    setMaxChoices(max) {
        if (typeof max !== 'number') throw new TypeError('Max must be a number');
        if (max < 0) throw new RangeError('Max must be greater than 0');
        if (max > 25) throw new RangeError('Max must be less than 25');
        this.data.max_values = max;
        return this;
    }

    setMax(max) {
        return this.setMaxChoices(max);
    }



    setMinChoices(min) {
        if (typeof min !== 'number') throw new TypeError('Min must be a number');
        if (min < 0) throw new RangeError('Min must be greater than 0');
        if (min > 25) throw new RangeError('Min must be less than 25');
        this.data.min_values = min;
        return this;
    }

    setMin(min) {
        return this.setMinChoices(min);
    }



    setDisabled(disabled) {
        this.data.disabled = Boolean(disabled);
        return this;
    }



    addOptions(...options) {
        for (const option of options) {
            if (Array.isArray(option)) {
                this.addOptions(...option);
                continue;
            }

            if (typeof option === 'object') {
                this.data.options.push(option);
            } else if (option instanceof SelectMenuOption) {
                this.data.options.push(option.data);
            } else {
                throw new TypeError('Option must be an object or SelectMenuOption');
            }
        }

        return this;
    }

    addOption(...options) {
        return this.addOptions(...options);
    }

    setOptions(...options) {
        this.data.options = [];
        return this.addOptions(...options);
    }

    setOption(...options) {
        return this.setOptions(...options);
    }



    toJSON() {
        return this.data;
    }

    build() {
        return this.toJSON();
    }

}