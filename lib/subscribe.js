let Howhap = require('howhap');
let _ = require('lodash');
module.exports = function(options) {
	let Subscription = require('./models/Subscription')(options.bookshelf);
	let subscriptionError = require('./error-handlers/subscription')(options.errors);
	return function(subscriberId, descriptor) {
		if(!_.isString(descriptor) || !descriptor.length) {
			return Promise.reject(
				new Howhap(
					options.errors.BAD_SUBSCRIPTION_DESCRIPTOR,
					{ descriptor: descriptor, type: typeof descriptor }
				)
			);
		}
		let subscription = new Subscription({
			descriptor: descriptor,
			subscriberId: subscriberId
		});
		return subscription.save().catch(subscriptionError);
	};
};