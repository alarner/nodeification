let Howhap = require('howhap');
let _ = require('lodash');
module.exports = function(options) {
	let Subscriber = require('./models/Subscriber')(options.bookshelf);
	let Subscriptions = require('./collections/Subscriptions')(options.bookshelf);
	let subscriberError = require('./error-handlers/subscriber')(options.errors);
	return function(type, key, userId, subscriptions) {
		if(!type) {
			throw new Howhap(options.errors.ADDSUBSCRIBER_INVALID_TYPE_ARG);
		}
		if(!key) {
			throw new Howhap(options.errors.ADDSUBSCRIBER_INVALID_KEY_ARG);
		}
		if(subscriptions) {
			if(!_.isArray(subscriptions)) {
				throw new Howhap(options.errors.ADDSUBSCRIBER_INVALID_SUBSCRIPTIONS_ARG);
			}
			subscriptions.forEach(subscription => {
				if(!_.isString(subscription)) {
					throw new Howhap(options.errors.ADDSUBSCRIBER_INVALID_SUBSCRIPTIONS_ARG);
				}
			});
		}
		let newSubscriber = new Subscriber({
			type: type,
			key: key,
			userId: userId ? userId : null
		});
		// @todo, make this a more efficient batch insert query
		return options.bookshelf.transaction(function(t) {
			newSubscriber.save(null, {transacting: t})
			.then(s => {
				if(Array.isArray(subscriptions) && subscriptions.length) {
					let subscriptionCollection = Subscriptions.forge(subscriptions.map(descriptor => {
						return {
							descriptor: descriptor,
							subscriberId: s.id
						};
					}));
					return Promise.all(subscriptionCollection.invoke('save', null, {transacting: t}))
					.then(t.commit)
					.catch(t.rollback);
				}
				return t.commit();
			})
			.catch(subscriberError);
		});
	};
};