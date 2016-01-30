'use strict';

var Howhap = require('howhap');
module.exports = function (errors) {
	return function (err) {
		if (err.code === '23505' && err.constraint === 'type_key') {
			var regex = /Key \(type, key\)=\((.+?), (.+?)\) already exists\./;
			var match = err.detail.match(regex);
			return Promise.reject(new Howhap(errors.DUPLICATE_SUBSCRIBER, { type: match[1], key: match[2] }));
		}
		return Promise.reject(new Howhap(errors.UNKNOWN, { error: err }));
	};
};