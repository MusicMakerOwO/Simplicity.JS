module.exports = class EmbedError extends Error {
	constructor(message) {
		super(message);
		this.name = 'EmbedError';
	}
}