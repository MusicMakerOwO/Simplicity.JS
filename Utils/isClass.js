module.exports = function(obj) {
	try {
		return typeof obj === 'function' &&
			/^class\s/.test(Function.prototype.toString.call(obj));
	} catch (err) {
		// this only happens when obj is a proxy, in which case it is a class
		return true;
	}	
}