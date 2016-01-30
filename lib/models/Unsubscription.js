let model = null;
module.exports = function(bookshelf) {
	model = model || bookshelf.model('Unsubscription', {
		tableName: 'unsubscriptions',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscription: function() {
			this.belongsTo('Subscription', 'subscriptionId');
		}
	});
	return model;
};