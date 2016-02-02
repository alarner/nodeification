'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Howhap = require('howhap');
var _ = require('lodash');
module.exports = function (options) {
	var Subscription = require('./models/Subscription')(options.bookshelf);
	var Unsubscription = require('./models/Unsubscription')(options.bookshelf);
	var unsubscriptionError = require('./error-handlers/unsubscription')(options.errors);
	return function (subscriberId, descriptor, reason) {
		if (!_.isString(descriptor) || !descriptor.length) {
			return Promise.reject(new Howhap(options.errors.BAD_SUBSCRIPTION_DESCRIPTOR, { descriptor: descriptor, type: typeof descriptor === 'undefined' ? 'undefined' : _typeof(descriptor) }));
		}
		var subscription = new Subscription({
			descriptor: descriptor,
			subscriberId: subscriberId
		});
		return subscription.fetch().then(function (subscription) {
			if (!subscription) {
				return Promise.reject(new Howhap(options.errors.UNKNOWN_SUBSCRIPTION, { subscriberId: subscriberId, descriptor: descriptor }));
			}
			reason = reason ? reason + '' : '';
			var unsubscription = new Unsubscription({
				subscriptionId: subscription.id,
				reason: reason
			});
			return unsubscription.save().catch(unsubscriptionError);
		});
	};
};