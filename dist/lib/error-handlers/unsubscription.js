'use strict';

var Howhap = require('howhap');
module.exports = function (errors) {
	return function (err) {
		if (err.code === '23505' && err.constraint === 'subscriptionid') {
			var regex = /Key \("subscriptionId"\)=\((.+?)\) already exists\./;
			var match = err.detail.match(regex);
			return Promise.reject(new Howhap(errors.DUPLICATE_UNSUBSCRIPTION, { subscriptionId: match[1] }));
		}
		return Promise.reject(new Howhap(errors.UNKNOWN, { error: err }));
	};
};