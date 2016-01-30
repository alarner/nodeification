'use strict';

var Howhap = require('howhap');
var knex = require('knex');
/*
 * options
 * {
 *		routes: {...},
 * 		knex: {...},
 * 		viewPath: {...}
 * }
 */
module.exports = function (options) {
	var defaults = {
		routes: {},
		knex: null,
		viewPath: '',
		errors: require('./errors')
	};
	var k = knex({
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			user: 'your_database_user',
			password: 'your_database_password',
			database: 'myapp_test'
		}
	});
	console.log(k.constructor);
	// options = options || {};
	// options = _.extend(defaults, options);
	// return {
	// 	addSubscriber: require('./lib/addSubscriber')(options.knex)
	// };
};