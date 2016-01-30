let model = null;
module.exports = function(bookshelf) {
	model = model || bookshelf.model('Subscription', {
		tableName: 'subscriptions',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscriber: function() {
			this.belongsTo('Subscriber', 'subscriberId');
		},
		unsubscription: function() {
			this.hasOne('Unsubscription', 'subscriptionId');
		},
		notifications: function() {
			this.hasMany('Notification', 'subscriptionId');
		}
	});
	return model;
};