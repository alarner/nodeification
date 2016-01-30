let model = null;
module.exports = function(bookshelf) {
	model = model || bookshelf.model('Notification', {
		tableName: 'notifications',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscription: function() {
			this.belongsTo('Subscription', 'subscriptionId');
		}
	});
	return model;
};