module.exports = function(bookshelf) {
	let Subscription = require('../models/Subscription')(bookshelf);
	return bookshelf.Collection.extend({
		model: Subscription
	});
};