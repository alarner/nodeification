let Howhap = require('howhap');
module.exports = function(errors) {
	return function(err) {
		if(err.code === '23505' && err.constraint === 'descriptor_subscriberid') {
			let regex = /Key \(descriptor, "subscriberId"\)=\((.+?), (.+?)\) already exists\./;
			let match = err.detail.match(regex);
			return Promise.reject(
				new Howhap(
					errors.DUPLICATE_SUBSCRIPTION,
					{ descriptor: match[1], subscriberId: match[2] }
				)
			);
		}
		if(err.code === 'SQLITE_CONSTRAINT') {
			let regex = /.*values \('.*', '(.*)', (.*), '.*'\) \- SQLITE_CONSTRAINT\: UNIQUE constraint failed\: subscriptions\.descriptor, subscriptions\.subscriberId/;
			let match = err.toString().match(regex);
			if(match) {
				return Promise.reject(
					new Howhap(
						errors.DUPLICATE_SUBSCRIPTION,
						{ descriptor: match[1], subscriberId: match[2] }
					)
				);
			}
		}
		if(err.code === '23503' && err.constraint === 'subscriptions_subscriberid_foreign') {
			let regex = /Key \(subscriberId\)=\((.+?)\) is not present in table "subscribers"\./;
			let match = err.detail.match(regex);
			return Promise.reject(
				new Howhap(
					errors.UNKNOWN_SUBSCRIBER_ID,
					{ subscriberId: match[1] }
				)
			);
		}
		return Promise.reject(
			new Howhap(
				errors.UNKNOWN,
				{ error: err }
			)
		);
	};
};