const ClosestMatch = require('../../Utils/ClosestMatch.js');
const ActionRow = require('./ActionRow.js');

module.exports = class ModalQuestion {

	static styles = [ 'short', 'long' ];
	get styles() {
		return this._style;
	}

	static import(data) {
		if (data.type !== 4) {
			throw new Error('Invalid import: Not a modal question');
		}

		if (!ModalQuestion.isValid(data)) {
			throw new Error('Invalid import: Invalid question data');
		}

		const question = new ModalQuestion();

		question.type = data.type;
		question.custom_id = data.custom_id;
		question.style = data.style;
		question.label = data.label;
		question.min_length = data.min_length;
		question.max_length = data.max_length;
		question.required = data.required;
		question.value = data.value;
		question.placeholder = data.placeholder;

		return question;
	}

	/*
	type			integer		4 for a text input
	custom_id		string		Developer-defined identifier for the input; max 100 characters
	style			integer		The Text Input Style
	label			string		Label for this component; max 45 characters
	min_length?		integer		Minimum input length for a text input; min 0, max 4000
	max_length?		integer		Maximum input length for a text input; min 1, max 4000
	required?		boolean		Whether this component is required to be filled (defaults to true)
	value?			string		Pre-filled value for this component; max 4000 characters
	placeholder?	string		Custom placeholder text if the input is empty; max 100 characters
	*/

	static isValid(question) {
		if (question instanceof ModalQuestion) {
			return true;
		}

		const fields = [
			{ name: 'type', 		type: 'number',		required: true, 	check: ({ type }) => type === 4 										},
			{ name: 'custom_id',	type: 'string',		required: true,		check: ({ custom_id }) => custom_id.length > 1 && custom_id.length < 100 },
			{ name: 'style', 		type: 'number',		required: true,		check: ({ style }) => style === 1 || style === 2						},
			{ name: 'label',		type: 'string',		required: true,		check: ({ label }) => label.length > 1 && label.length < 45				},
			{ name: 'min_length', 	type: 'number',		required: false, 	check: ({ min_length, max_length = 4000 }) => min_length < max_length 	},
			{ name: 'max_length', 	type: 'number', 	required: false, 	check: ({ min_length, max_length = 4000 }) => min_length < max_length 	},
			{ name: 'required',		type: 'boolean',	required: false, 	check: ({ required }) => true 										  	},
			{ name: 'value', 		type: 'value',		required: false, 	check: ({ value, max_length = 4000}) => value.length < max_length		},
			{ name: 'placeholder', 	type: 'string', 	required: false, 	check: ({ placeholder }) => placeholder.length < 100					}
		]

		for (const field of fields) {
			const value = question[field.name];

			if (value === undefined) {
				if (!field.required) continue;
				return false;
			}

			if (typeof value !== field.type) {
				return false;
			}

			if (!field.check(question)) {
				return false;
			}
		}

		return true;
	}

	constructor(data) {
		this.type = 4;
		this.custom_id = Math.random().toString(36).substring(2, 8);
		this.style = 1;
		this.label = 'Hmm, it seems you forgot to set a question...';
		this.min_length = 0;
		this.max_length = 4000;
		this.required = true;
		this.value = null;
		this.placeholder = null;

		if (data) {
			this.import(data);
		}
	}

	setCustomID(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid argument: id must be a string');
		}

		if (id.length < 1 || id.length > 100) {
			throw new Error('Invalid argument: id must be between 1 and 100 characters');
		}

		this.custom_id = id;
		return this;
	}

	setStyle(style) {
		if (typeof style !== 'string' && typeof style !== 'number') {
			throw new TypeError('Invalid argument: Style must be a string or number');
		}

		if (typeof style === 'string') {
			style = ModalQuestion.styles.indexOf( ClosestMatch(style, ModalQuestion.styles) ) + 1;
		}

		if (style < 1 || style > ModalQuestion.styles.length) {
			throw new RangeError('Invalid argument: Style must be between 1 and ' + ModalQuestion.styles.length);
		}

		this.style = style;
		return this;
	}

	setQuestion(label) {
		if (typeof label !== 'string') {
			throw new TypeError('Invalid argument: Question must be a string');
		}

		if (label.length < 1 || label.length > 45) {
			throw new RangeError('Invalid argument: Question must be between 1 and 45 characters');
		}

		this.label = label;
		return this;
	}

	setMinLength(min) {
		if (typeof min !== 'number') {
			throw new TypeError('Invalid argument: Min length must be a number');
		}

		if (min < 0 || min > 4000) {
			throw new RangeError('Invalid argument: Min length must be between 0 and 4000');
		}

		this.min_length = min;
		return this;
	}

	setMaxLength(max) {
		if (typeof max !== 'number') {
			throw new TypeError('Invalid argument: Max length must be a number');
		}

		if (max < 1 || max > 4000) {
			throw new RangeError('Invalid argument: Max length must be between 1 and 4000');
		}

		this.max_length = max;
		return this;
	}

	setRequired(required) {
		this.required = Boolean(required);
		return this;
	}

	setDefault(value) {
		if (typeof value !== 'string') {
			throw new TypeError('Invalid argument: Default value must be a string');
		}

		if (value.length > 4000) {
			throw new RangeError('Invalid argument: Default value must be less than 4000 characters');
		}

		this.value = value;
		return this;
	}

	setPlaceholder(placeholder) {
		if (typeof placeholder !== 'string') {
			throw new TypeError('Invalid argument: Placeholder must be a string');
		}

		if (placeholder.length > 100) {
			throw new RangeError('Invalid argument: Placeholder must be less than 100 characters');
		}

		this.placeholder = placeholder;
		return this;
	}

	toJSON() {
		if (this.min_length > this.max_length) throw new Error('Invalid question: Min length must be less than max length');
		if (this.value?.length > this.max_length) throw new Error('Invalid question: Value must be less than max length');

		return new ActionRow().addComponent({
			type: this.type,
			custom_id: this.custom_id,
			style: this.style,
			label: this.label,
			min_length: this.min_length,
			max_length: this.max_length,
			required: this.required,
			value: this.value,
			placeholder: this.placeholder
		}).toJSON();
	}
}