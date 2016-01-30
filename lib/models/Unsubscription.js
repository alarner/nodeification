module.exports = function(bookshelf) {
	return bookshelf.model('Unsubscription', {
		tableName: 'unsubscriptions',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscription: function() {
			this.belongsTo('Subscription', 'subscriptionId');
		}
	});
};