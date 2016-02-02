'use strict';

var model = null;
module.exports = function (bookshelf) {
	model = model || bookshelf.model('Subscription', {
		tableName: 'subscriptions',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscriber: function subscriber() {
			this.belongsTo('Subscriber', 'subscriberId');
		},
		unsubscription: function unsubscription() {
			this.hasOne('Unsubscription', 'subscriptionId');
		},
		notifications: function notifications() {
			this.hasMany('Notification', 'subscriptionId');
		}
	});
	return model;
};