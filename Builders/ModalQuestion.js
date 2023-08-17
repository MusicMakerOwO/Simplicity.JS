
/*
// this is a modal
{
  "title": "My Cool Modal",
  "custom_id": "cool_modal",
  "components": [{
    "type": 1,
    "components": [{
      "type": 4,
      "custom_id": "name",
      "label": "Name",
      "style": 1,
      "min_length": 1,
      "max_length": 4000,
      "placeholder": "John",
      "required": true
    }]
  }]
}
*/


/*
new ModalQuestion()
    .setCustomId('name')
    .setQuestion('What is your name?')
    .setPlaceholder('Last name, first name')
    .setDefaultValue('John')
    .setMinLength(1)
    .setMaxLength(4000)
    .setStyle('Paragraph')
    .setRequired(true)
*/

const ActionRow = require('./ActionRow');
const ClosestMatch = require('../Utils/ClosestMatch');
const Log = require('../Utils/Logs.js');

module.exports = class ModalQuestion {
    constructor() {
        
        this.data = {
            type: 4,
            custom_id: Math.random().toString(36).substring(2, 15),
            label: 'Do you prefer cats or dogs?',
            placeholder: null,
            value: null,
            style: 1,
            min_length: 1,
            max_length: 4000,
            required: true
        };

    }

    setCustomID(customId) {
        if (typeof customId !== 'string') throw new Error('Custom ID must be a string - Received: ' + typeof customId);
        if (customId.length > 100) throw new Error('Custom ID must be under 100 characters');
        if (customId.length < 1) throw new Error('Custom ID must be at least 1 character');
        this.data.custom_id = customId;
        return this;
    }

    setQuestion(question) {
        if (typeof question !== 'string') throw new Error('Question must be a string - Received: ' + typeof question);
        if (question.length > 45) throw new Error('Question must be under 45 characters');
        if (question.length < 1) throw new Error('Question must be at least 1 character');
        this.data.label = question;
        return this;
    }

    setPlaceholder(placeholder) {
        if (typeof placeholder !== 'string') throw new Error('Placeholder must be a string - Received: ' + typeof placeholder);
        if (placeholder.length > 100) throw new Error('Placeholder must be under 100 characters');
        this.data.placeholder = placeholder;
        return this;
    }

    setValue(value) {
        return this.setDefaultValue(value);
    }

    setDefaultValue(defaultValue) {
        if (typeof defaultValue !== 'string') throw new Error('Default Value must be a string - Received: ' + typeof defaultValue);
        if (defaultValue.length > 100) throw new Error('Default Value must be under 100 characters');
        this.data.value = defaultValue;
        return this;
    }

    setMinLength(minLength) {
        if (typeof minLength !== 'number') throw new Error('Min Length must be a number - Received: ' + typeof minLength);
        if (minLength < 0) throw new Error('Min Length must be at least 0');
        this.data.min_length = minLength;
        return this;
    }

    setMaxLength(maxLength) {
        if (typeof maxLength !== 'number') throw new Error('Max Length must be a number - Received: ' + typeof maxLength);
        if (maxLength > 4000) throw new Error('Max Length must be under 4000');
        if (maxLength < 1) throw new Error('Max Length must be at least 1');
        this.data.max_length = maxLength;
        return this;
    }

    setRequired(required) {
        this.data.required = Boolean(required);
        return this;
    }

    setStyle(style) {

        if (typeof style === 'number') {
            if (style !== 1 && style !== 2) throw new Error('Style must be 1 or 2');
            this.data.style = style;
            return this;
        }

        if (typeof style !== 'string') throw new Error('Style must be a string or number - Received: ' + typeof style);

        const StyleChoices = {
            'short': 1,
            'paragraph': 2
        };

        if (!StyleChoices[style.toLowerCase()]) {
            const Closest = ClosestMatch(style.toLowerCase(), Object.keys(StyleChoices));
            Log.warn(`Unknown modal style '${style}' - Using closest match: '${Closest}'`);
            this.data.style = StyleChoices[Closest];
            return this;
        }

        this.data.style = StyleChoices[style.toLowerCase()];
        return this;
    }

    toJSON() {
        let question = new ActionRow().addComponent(this.data);
        return question.toJSON();
    }

    build() {
        return this.toJSON();
    }

};