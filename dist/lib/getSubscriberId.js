'use strict';

var _ = require('lodash');
var Howhap = require('howhap');
module.exports = function (options) {
	var Subscriber = require('./models/Subscriber')(options.bookshelf);
	return function (fn) {
		if (!_.isFunction(fn)) {
			throw new Howhap(options.errors.GETSUBSCRIBERID_INVALID_FN_ARG);
		}
		return function () {
			var _arguments = arguments;

			if (arguments.length > 0 && _.isInteger(arguments[0])) {
				return fn.apply(null, arguments);
			} else if (arguments.length > 1 && _.isString(arguments[0]) && _.isString(arguments[1])) {
				return Subscriber.forge({ type: arguments[0], key: arguments[1] }).fetch().then(function (subscriber) {
					if (!subscriber) {
						return Promise.reject(new Howhap(options.errors.UNKNOWN_SUBSCRIBER, { type: _arguments[0], key: _arguments[1] }));
					}
					var args = Array.prototype.slice.call(_arguments, 2);
					args.unshift(subscriber.id);
					return fn.apply(null, args);
				}).catch(function (err) {
					if (err instanceof Howhap) {
						return Promise.reject(err);
					}
					return Promise.reject(new Howhap(options.errors.UNKNOWN, { error: err }));
				});
			}

			return Promise.reject(new Howhap(options.errors.GETSUBSCRIBERID_INVALID_ARGS));
		};
	};
};