'use strict';

module.exports = function (bookshelf) {
	var Subscription = require('../models/Subscription')(bookshelf);
	return bookshelf.Collection.extend({
		model: Subscription
	});
};