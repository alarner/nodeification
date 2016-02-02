'use strict';

var sendTask = require('./send-task');
var Howhap = require('howhap');
var async = require('async');
module.exports = function (options) {
	return function (descriptor, customParams, force) {
		var info = null;
		var uriParams = null;
		for (var i = 0; i < options.parsedRoutes.length; i++) {
			info = options.parsedRoutes[i];
			uriParams = info.route.match(descriptor);
			if (uriParams) {
				break;
			}
		}

		if (uriParams === null) {
			return Promise.reject(new Howhap(options.errors.MISSING_HANDLER, { descriptor: descriptor }));
		}

		var numFoundUsers = null;
		var totalNotificationsQueued = 0;
		var page = 0;
		var queue = async.queue(sendTask(options.viewPath, options), options.concurrency);
		var where = {
			'subscriptions.descriptor': descriptor
		};
		var select = ['subscribers.type', 'subscribers.key', 'subscriptions.id as subscriptionId'];
		if (options.hasUsers) {
			select.push('users.*');
			where['users.deletedAt'] = null;
		}
		if (!force) {
			where['unsubscriptions.id'] = null;
		}

		return new Promise(function (resolve, reject) {
			async.doUntil(
			// Grab users
			function (cb) {
				page++;
				var query = knex.select.apply(knex, select).from('subscriptions').innerJoin('subscribers', 'subscriptions.subscriberId', 'subscribers.id');
				if (options.hasUsers) {
					query = query.leftJoin('users', 'subscribers.userId', 'users.id');
				}
				if (!force) {
					query = query.leftJoin('unsubscriptions', 'subscriptions.id', 'unsubscriptions.subscriptionId');
				}

				query.where(where).limit(options.batchSize).offset((page - 1) * options.batchSize).then(function (users) {
					numFoundUsers = users.length;
					totalNotificationsQueued += numFoundUsers;
					var tasks = users.map(function (user) {
						var type = user.type;
						var key = user.key;
						var subscriptionId = user.subscriptionId;
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
					queue.push(tasks, function (err) {
						if (err) {
							logger.warn(err.toString());
						}
					});
					cb();
				});
			},
			// Test if userList is empty
			function () {
				return numFoundUsers < options.batchSize;
			},
			// Finished
			function (err) {
				if (err) {
					return reject(new Howhap(options.errors.UNKNOWN, { error: err.toString() }));
				}
				queue.drain = function () {
					resolve(totalNotificationsQueued);
				};
			});
		});
	};
};