'use strict';

module.exports = function (options) {
	var Subscriber = require('./models/Subscriber')(options.knex);
	var subscriberError = require('./error-handlers/subscriber')(options.errors);
	var bookshelf = require('bookshelf')(options.knex);
	return function (type, key, userId, subscriptions) {
		var newSubscriber = new Subscriber({
			type: type,
			key: key,
			userId: userId ? userId : null
		});
		// @todo, make this a more efficient batch insert query
		return bookshelf.transaction(function (t) {
			newSubscriber.save(null, { transacting: t }).then(function (s) {
				if (Array.isArray(subscriptions) && subscriptions.length) {
					var subscriptionCollection = Subscriptions.forge(subscriptions.map(function (descriptor) {
						return {
							descriptor: descriptor,
							subscriberId: s.id
						};
					}));
					return Promise.all(subscriptionCollection.invoke('save', null, { transacting: t })).then(t.commit).catch(t.rollback);
				}
				return t.commit();
			}).catch(subscriberError);
		});
	};
};