'use strict';

module.exports = function (bookshelf) {
	var Subscriber = require('../models/Subscriber')(bookshelf);
	return bookshelf.Collection.extend({
		model: Subscriber
	});
};