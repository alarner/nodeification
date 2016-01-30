module.exports = function(bookshelf) {
	return bookshelf.model('Subscriber', {
		tableName: 'subscribers',
		hasTimestamps: ['createdAt', 'updatedAt'],
		subscriptions: function() {
			this.hasMany('Subscription', 'subscriberId');
		}
	});
};