'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Howhap = require('howhap');
var _ = require('lodash');
module.exports = function (options) {
	var Subscription = require('./models/Subscription')(options.bookshelf);
	var subscriptionError = require('./error-handlers/subscription')(options.errors);
	return function (subscriberId, descriptor) {
		if (!_.isString(descriptor) || !descriptor.length) {
			return Promise.reject(new Howhap(options.errors.BAD_SUBSCRIPTION_DESCRIPTOR, { descriptor: descriptor, type: typeof descriptor === 'undefined' ? 'undefined' : _typeof(descriptor) }));
		}
		var subscription = new Subscription({
			descriptor: descriptor,
			subscriberId: subscriberId
		});
		return subscription.save().catch(subscriptionError);
	};
};