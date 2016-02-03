let gcm = require('node-gcm');
let templateLoader = require('../template-loader');
let _ = require('lodash');
let path = require('path');
module.exports = function(task, handlerConfig, viewPath, notificationConfig) {
	return new Promise((resolve, reject) => {
		let sender = new gcm.Sender(notificationConfig.adapters['push-android'].key);
		let registrationTokens = [task.key];
		let messageOptions = _.extend({
			collapseKey: task.handler,
			data: {},
			notification: {}
		}, handlerConfig);
		templateLoader(
			path.join(viewPath, task.handler, 'push-android', 'body.ejs'),
			function(err, template) {
				if(err) {
					return reject(err);
				}
				messageOptions.notification.body = template(task);
				if(messageOptions.notification.title) {
					messageOptions.notification.title = _.template(messageOptions.notification.title)(task);
				}
				let message = new gcm.Message(messageOptions);
				sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
					if(err) {
						return reject(err);
					}
					return resolve(response);
				});
			}
		);
	});
};