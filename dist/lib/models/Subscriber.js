'use strict';

module.exports = function (knex) {
	var bookshelf = require('bookshelf')(knex);
	return bookshelf.model('Subscriber', {
		tableName: 'subscribers',
		hasTimestamps: ['createdAt', 'updatedAt']
	});
};