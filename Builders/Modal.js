const ActionRow = require('./ActionRow.js');
const ModalQuestion = require('./ModalQuestion.js');

module.exports = class Modal {
    constructor() {
        this.data = {
            title: 'My Modal',
            custom_id: Math.random().toString(36).substring(2, 15),
            components: []
        };

        this.maxSizeError = false;
    }

    setTitle(title) {
        if (typeof title !== 'string') throw new Error('Title must be a string - Received: ' + typeof title);
        if (title.length > 45) throw new Error('Title must be under 45 characters');
        if (title.length < 1) throw new Error('Title must be at least 1 character');
        this.data.title = title;
        return this;
    }

    setCustomID(customId) {
        if (typeof customId !== 'string') throw new Error('Custom ID must be a string - Received: ' + typeof customId);
        if (customId.length > 100) throw new Error('Custom ID must be under 100 characters');
        if (customId.length < 1) throw new Error('Custom ID must be at least 1 character');
        this.data.custom_id = customId;
        return this;
    }

    /*
    .setQuestions(
        {
            label: 'Do you prefer cats or dogs?',
            placeholder: 'Cats or dogs?',
            ...
        },
        new ModalQuestion()
            .setQuestion('Do you prefer cats or dogs?')
            .setPlaceholder('Cats or dogs?')
            ...
    )
    */
    setQuestions(...questions) {
        for (let question of questions) {
            if (Array.isArray(question)) {
                this.setQuestions(...question);
                continue;
            }

            if (typeof question !== 'object') throw new TypeError(`Question must be an object - Received: ${typeof question}`);

            if (typeof question.toJSON === 'function') {
                question = question.toJSON();
            }
            // check it's inside an ActionRow
            if (question.type !== 1) {
                question = new ActionRow().addComponents(question).toJSON();
            }

            // check it's a ModalQuestion
            if (question.components[0].type !== 4) {
                throw new TypeError(`Component type must be of type 4 (ModalQuestion) - Received: ${question.components[0].type}`);
            }

            if (this.data.components.length >= 5) {
                if (!this.maxSizeError) {
                    Log.warn('Modals cannot have more than 5 questions');
                    this.maxSizeError = true;
                }
                break;
            }

            this.data.components.push(question);
        }

        return this;
    }

    toJSON() {
        return {
            title: this.data.title,
            custom_id: this.data.custom_id,
            components: this.data.components
        }
    }

    build() {
        return this.toJSON();
    }

}