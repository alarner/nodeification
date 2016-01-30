let _ = require('lodash');
let Howhap = require('howhap');
module.exports = function(options) {
	let Subscriber = require('./models/Subscriber')(options.bookshelf);
	return function(fn) {
		if(!_.isFunction(fn)) {
			throw new Howhap(
				options.errors.GETSUBSCRIBERID_INVALID_FN_ARG
			);
		}
		return function() {
			if(arguments.length > 0 && _.isInteger(arguments[0])) {
				return fn.apply(null, arguments);
			}
			else if(arguments.length > 1 && _.isString(arguments[0]) && _.isString(arguments[1])) {
				return Subscriber
				.forge({type: arguments[0], key: arguments[1]})
				.fetch()
				.then(subscriber => {
					if(!subscriber) {
						return Promise.reject(
							new Howhap(
								options.errors.UNKNOWN_SUBSCRIBER,
								{ type: arguments[0], key: arguments[1] }
							)
						);
					}
					let args = Array.prototype.slice.call(arguments, 2);
					args.unshift(subscriber.id);
					return fn.apply(null, args);
				})
				.catch((err) => {
					if(err instanceof Howhap) {
						return Promise.reject(err);
					}
					return Promise.reject(
						new Howhap(
							options.errors.UNKNOWN,
							{ error: err }
						)
					);
				});
			}

			return Promise.reject(
				new Howhap(
					options.errors.GETSUBSCRIBERID_INVALID_ARGS
				)
			);
		};
	};
};