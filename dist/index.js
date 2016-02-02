'use strict';

var Howhap = require('howhap');
var knex = require('knex');
var _ = require('lodash');
var Route = require('url-pattern');
/*
 * options
 * {
 *		routes: {...},
 * 		knex: {...},
 * 		viewPath: {...},
 *		errors: {...},
 *		adapters: {
 * 			email: {...}	
 * 		},
 * 		concurrency: 300,
 *		batchSize: 300,
 *		hasUsers: false
 * }
 */
module.exports = function (options) {
	var defaults = {
		routes: [],
		knex: null,
		viewPath: '',
		errors: require('./errors'),
		concurrency: 300,
		batchSize: 300,
		adapters: {}
	};
	options = options || {};
	options = _.extend(defaults, options);
	if (!options.knex) {
		throw new Howhap(options.errors.MISSING_KNEX_OPTION);
	}
	if (!options.viewPath) {
		throw new Howhap(options.errors.MISSING_VIEWPATH_OPTION);
	}
	if (!options.knex.hasOwnProperty('__knex__')) {
		options.knex = knex(options.knex);
	}
	options.bookshelf = require('bookshelf')(options.knex);
	options.bookshelf.plugin('registry');

	options.parsedRoutes = [];
	options.routes.forEach(function (route) {
		options.parsedRoutes.push({
			route: new Route(route.pattern),
			handler: route.handler
		});
	});

	var getSubscriberId = require('./lib/getSubscriberId')(options);
	return {
		addSubscriber: require('./lib/addSubscriber')(options),
		subscribe: getSubscriberId(require('./lib/subscribe')(options)),
		unsubscribe: getSubscriberId(require('./lib/unsubscribe')(options)),
		send: require('./lib/send')(options),
		Notification: require('./lib/models/Notification')(options.bookshelf),
		Subscriber: require('./lib/models/Subscriber')(options.bookshelf),
		Subscription: require('./lib/models/Subscription')(options.bookshelf),
		Unsubscription: require('./lib/models/Unsubscription')(options.bookshelf),
		Subscribers: require('./lib/collections/Subscribers')(options.bookshelf),
		Subscriptions: require('./lib/collections/Subscriptions')(options.bookshelf)
	};
};