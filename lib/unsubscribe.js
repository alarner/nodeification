let Howhap = require('howhap');
let _ = require('lodash');
module.exports = function(options) {
	let Subscription = require('./models/Subscription')(options.bookshelf);
	let Unsubscription = require('./models/Unsubscription')(options.bookshelf);
	let unsubscriptionError = require('./error-handlers/unsubscription')(options.errors);
	return function(subscriberId, descriptor, reason) {
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
		return subscription
		.fetch()
		.then(subscription => {
			if(!subscription) {
				return Promise.reject(
					new Howhap(
						options.errors.UNKNOWN_SUBSCRIPTION,
						{ subscriberId: subscriberId, descriptor: descriptor }
					)
				);
			}
			reason = reason ? reason+'' : '';
			let unsubscription = new Unsubscription({
				subscriptionId: subscription.id,
				reason: reason
			});
			return unsubscription
			.save()
			.catch(unsubscriptionError);
		});
	};
};