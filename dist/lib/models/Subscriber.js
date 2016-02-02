'use strict';

var model = null;
module.exports = function (bookshelf) {
	model = model || bookshelf.model('Subscriber', {
		tableName: 'subscribers',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscriptions: function subscriptions() {
			return this.hasMany('Subscription', 'subscriberId');
		}
	});
	return model;
};