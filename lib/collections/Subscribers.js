module.exports = function(bookshelf) {
	let Subscriber = require('../models/Subscriber')(bookshelf);
	return bookshelf.Collection.extend({
		model: Subscriber
	});
};