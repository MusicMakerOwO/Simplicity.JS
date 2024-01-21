const ModalQuestion = require('./ModalQuestion.js');

module.exports = class Modal {

	static import(data) {
		const modal = new Modal();

		modal.title = data.title;
		modal.custom_id = data.custom_id;

		for (const component of data.components) {
			if (!ModalQuestion.isValid(component)) throw new Error(`Invalid import: Invalid data on question ${data.components.indexOf(component) + 1}`);
			modal.components.push(ModalQuestion.import(component));
		}

		return modal;
	}

	constructor(data) {
		this.title = 'My Modal';
		this.custom_id = 'modal';
		this.components = [];

		if (data) {
			this.import(data);
		}
	}

	setTitle(title) {
		if (typeof title !== 'string') throw new TypeError('Title must be a string');
		if (title.length > 45) throw new RangeError('Title cannot exceed 45 characters');
		if (title.length < 1) throw new RangeError('Title must be at least 1 character');

		this.title = title;
		return this;
	}

	setCustomID(custom_id) {
		if (typeof custom_id !== 'string') throw new TypeError('Custom ID must be a string');
		if (custom_id.length > 100) throw new RangeError('Custom ID cannot exceed 100 characters');
		if (custom_id.length < 1) throw new RangeError('Custom ID must be at least 1 character');

		this.custom_id = custom_id;
		return this;
	}

	addQuestion(...questions) {
		for (const question of questions) {
			if (Array.isArray(question)) {
				this.addQuestion(...question);
				continue;
			}

			if (this.components >= 5) throw new RangeError('Modals cannot have more than 5 questions');
			if (!ModalQuestion.isValid(question)) throw new TypeError('Question must be a ModalQuestion');
			if (this.components.some(c => c.custom_id === question.custom_id)) throw new Error('Cannot have duplicate custom IDs');

			this.components.push( typeof question.toJSON === 'function' ? question.toJSON() : question );
		}

		return this;
	}

	addQuestions(...questions) {
		return this.addQuestion(questions);
	}

	toJSON() {
		return {
			title: this.title,
			custom_id: this.custom_id,
			components: this.components
		};
	}

}