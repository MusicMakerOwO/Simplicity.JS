/*
const selectMenu = new SelectMenu()
    .setCustomID('select')
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
        this.type = 3;
        this.custom_id = Math.random().toString(36).substring(2, 15);
        this.options = [];
        this.placeholder = '';
        this.min_values = 1;
        this.max_values = 1;
        this.disabled = false
    }



    setCustomID(id) {
        if (typeof id !== 'string') throw new TypeError('Custom ID must be a string');
        if (id.length > 100) throw new RangeError('Custom ID must be less than 100 characters');
        this.custom_id = id.toString();
        return this;
    }



    setPlaceholder(placeholder) {
        if (typeof placeholder !== 'string') throw new TypeError('Placeholder must be a string');
        if (placeholder.length > 100) throw new RangeError('Placeholder must be less than 100 characters');
        this.placeholder = placeholder.toString();
        return this;
    }



    setMaxChoices(max) {
        if (typeof max !== 'number') throw new TypeError('Max must be a number');
        if (max < 0) throw new RangeError('Max must be greater than 0');
        if (max > 25) throw new RangeError('Max must be less than 25');
        this.max_values = Number(max);
        return this;
    }

    setMax(max) {
        return this.setMaxChoices(max);
    }



    setMinChoices(min) {
        if (typeof min !== 'number') throw new TypeError('Min must be a number');
        if (min < 0) throw new RangeError('Min must be greater than 0');
        if (min > 25) throw new RangeError('Min must be less than 25');
        this.min_values = Number(min);
        return this;
    }

    setMin(min) {
        return this.setMinChoices(min);
    }



    setDisabled(disabled) {
        this.disabled = Boolean(disabled);
        return this;
    }



    addOptions(...options) {
        for (const option of options) {
            if (Array.isArray(option)) {
                this.addOptions(...option);
                continue;
            }

            if (typeof option === 'object') {
                this.options.push(option);
            } else if (option instanceof SelectMenuOption) {
                this.options.push(option.data);
            } else {
                throw new TypeError('Option must be an object or SelectMenuOption');
            }
        }

        return this;
    }

    setOptions(...options) {
        return this.addOptions(...options);
    }



    toJSON() {

        const tempMax = this.max_values;

        return {
            type: this.type,
            custom_id: this.custom_id,
            options: this.options,
            placeholder: this.placeholder,
            min_values: Math.min(this.min_values, this.max_values),
            max_values: Math.max(this.min_values, tempMax),
            disabled: this.disabled
        }
    }

}