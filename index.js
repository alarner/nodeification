let Howhap = require('howhap');
let knex = require('knex');
let _ = require('lodash');
/*
 * options
 * {
 *		routes: {...},
 * 		knex: {...},
 * 		viewPath: {...}
 * }
 */
module.exports = function(options) {
	let defaults = {
		routes: {},
		knex: null,
		viewPath: '',
		errors: require('./errors')
	};
	options = options || {};
	options = _.extend(defaults, options);
	if(!options.knex) {
		throw new Howhap(
			options.errors.MISSING_KNEX_OPTION
		);
	}
	if(!options.viewPath) {
		throw new Howhap(
			options.errors.MISSING_VIEWPATH_OPTION
		);
	}
	if(!options.knex.hasOwnProperty('__knex__')) {
		options.knex = knex(options.knex);
	}
	options.bookshelf = require('bookshelf')(options.knex);
	options.bookshelf.plugin('registry');
	return {
		addSubscriber: require('./lib/addSubscriber')(options),
		subscribe: null,
		unsubscribe: null,
		send: null
	};
};