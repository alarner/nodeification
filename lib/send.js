let sendTask = require('./send-task');
let Howhap = require('howhap');
let async = require('async');
module.exports = function(options) {
	return function(descriptor, customParams, force) {
		let info = null;
		let uriParams = null;
		for(let i=0; i<options.parsedRoutes.length; i++) {
			info = options.parsedRoutes[i];
			uriParams = info.route.match(descriptor);
			if(uriParams) {
				break;
			}
		}

		if(uriParams === null) {
			return Promise.reject(
				new Howhap(
					options.errors.MISSING_HANDLER,
					{ descriptor: descriptor }
				)
			);
		}

		let numFoundUsers = null;
		let totalNotificationsQueued = 0;
		let page = 0;
		let queue = async.queue(
			sendTask(options.viewPath, options),
			options.concurrency
		);
		let where = {
			'subscriptions.descriptor': descriptor
		};
		let select = ['subscribers.type', 'subscribers.key', 'subscriptions.id as subscriptionId'];
		if(options.hasUsers) {
			select.push('users.*');
			where['users.deletedAt'] = null;
		}
		if(!force) {
			where['unsubscriptions.id'] = null;
		}

		return new Promise((resolve, reject) => {
			async.doUntil(
				// Grab users
				cb => {
					page++;
					let query = knex
					.select.apply(knex, select)
					.from('subscriptions')
					.innerJoin('subscribers', 'subscriptions.subscriberId', 'subscribers.id');
					if(options.hasUsers) {
						query = query.leftJoin('users', 'subscribers.userId', 'users.id');
					}
					if(!force) {
						query = query.leftJoin(
							'unsubscriptions',
							'subscriptions.id',
							'unsubscriptions.subscriptionId'
						);
					}
					
					query.where(where)
					.limit(options.batchSize)
					.offset((page-1)*options.batchSize)
					.then(users => {
						numFoundUsers = users.length;
						totalNotificationsQueued += numFoundUsers;
						let tasks = users.map(user => {
							let type = user.type;
							let key = user.key;
							let subscriptionId = user.subscriptionId;
							delete user.type;
							delete user.key;
							delete user.subscriptionId;
							return {
								user: user,
								type: type,
								key: key,
								subscriptionId: subscriptionId,
								customParams: customParams,
								uriParams: uriParams,
								handler: info.handler
							};
						});
						queue.push(tasks, err => {
							if(err) {
								logger.warn(err.toString());
							}
						});
						cb();
					});

				},
				// Test if userList is empty
				() => {
					return numFoundUsers < options.batchSize;
				},
				// Finished
				err => {
					if(err) {
						return reject(
							new Howhap(
								options.errors.UNKNOWN,
								{ error: err.toString() }
							)
						);
					}
					queue.drain = () => {
						resolve(totalNotificationsQueued);
					};
				}
			);
		});
	};
};