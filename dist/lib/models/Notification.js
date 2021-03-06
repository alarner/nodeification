'use strict';

var model = null;
module.exports = function (bookshelf) {
	model = model || bookshelf.model('Notification', {
		tableName: 'notifications',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscription: function subscription() {
			this.belongsTo('Subscription', 'subscriptionId');
		}
	});
	return model;
};