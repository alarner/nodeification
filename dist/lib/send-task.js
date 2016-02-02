'use strict';

var path = require('path');
var email = require('./adapters/email');
var androidPush = require('./adapters/android-push');
var iosPush = require('./adapters/ios-push');
var text = require('./adapters/text');
var handlerConfig = {};

module.exports = function (viewPath, notificationConfig) {

	function loadConfig(handler, type) {
		if (!handlerConfig.hasOwnProperty(handler) || !handlerConfig[handler].hasOwnProperty(type)) {
			var newConfig = require(path.join(viewPath, handler, type, 'config'));
			if (newConfig) {
				handlerConfig[handler] = handlerConfig[handler] || {};
				handlerConfig[handler][type] = newConfig;
			}
		}
		return handlerConfig[handler][type];
	}

	return function (task, cb) {
		switch (task.type.toLowerCase()) {
			case 'email':
				email(task, loadConfig(task.handler, task.type), viewPath, notificationConfig, cb);
				break;
			case 'android-push':
				androidPush(task, loadConfig(task.handler, task.type), viewPath, notificationConfig, cb);
				break;
			case 'ios-push':
				iosPush(task, loadConfig(task.handler, task.type), viewPath, notificationConfig, cb);
				break;
			case 'text':
				text(task, loadConfig(task.handler, task.type), viewPath, notificationConfig, cb);
				break;
		}
	};
};