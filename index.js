let Howhap = require('howhap');
let knex = require('knex');
let _ = require('lodash');
let Route = require('url-pattern');
/*
 * options
 * {
 *		routes: {...},
 * 		knex: {...},
 * 		viewPath: {...},
 *		errors: {...}
 * }
 */
module.exports = function(options) {
	let defaults = {
		routes: [],
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

	options.parsedRoutes = [];
	options.routes.forEach(route => {
		options.parsedRoutes.push({
			route: new Route(route.pattern),
			handler: route.handler
		});
	});

	let getSubscriberId = require('./lib/getSubscriberId')(options);
	return {
		addSubscriber: require('./lib/addSubscriber')(options),
		subscribe: getSubscriberId(require('./lib/subscribe')(options)),
		unsubscribe: getSubscriberId(require('./lib/unsubscribe')(options)),
		send: require('./lib/send')(options)
	};
};