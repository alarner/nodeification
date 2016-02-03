let path = require('path');
let Howhap = require('howhap');
let email = require('./adapters/email');
let androidPush = require('./adapters/push-android');
let iosPush = require('./adapters/push-ios');
let text = require('./adapters/text');
let handlerConfig = {};

module.exports = function(viewPath, notificationConfig) {

	function loadConfig(handler, type) {
		if(!handlerConfig.hasOwnProperty(handler) || !handlerConfig[handler].hasOwnProperty(type)) {
			let newConfig = require(path.join(viewPath, handler, type, 'config'));
			if(newConfig) {
				handlerConfig[handler] = handlerConfig[handler] || {};
				handlerConfig[handler][type] = newConfig;
			}
		}
		return handlerConfig[handler][type];
	}

	return function(task, cb) {
		let promise = null;
		switch(task.type.toLowerCase()) {
			case 'email':
				promise = email(
					task,
					loadConfig(task.handler, task.type),
					viewPath,
					notificationConfig
				);
			break;
			case 'push-android':
				promise = androidPush(
					task,
					loadConfig(task.handler, task.type),
					viewPath,
					notificationConfig,
					cb
				);
			break;
			case 'push-ios':
				promise = iosPush(
					task,
					loadConfig(task.handler, task.type),
					viewPath,
					notificationConfig,
					cb
				);
			break;
			case 'text':
				promise = text(
					task,
					loadConfig(task.handler, task.type),
					viewPath,
					notificationConfig,
					cb
				);
			break;
			default:
				return cb(new Howhap(
					notificationConfig.errors.UNKNOWN_SUBSCRIPTION_TYPE,
					{ type: task.type }
				));
		}
		if(promise) {
			promise
			.then(result => cb())
			.catch(err => {
				// @todo deal with this error somehow, maybe log it
				cb();
			});
		}
	};
};