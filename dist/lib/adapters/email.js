'use strict';

var nodemailer = require('nodemailer');
var path = require('path');
var async = require('async');
var templateLoader = require('../template-loader');
var _ = require('lodash');

module.exports = function (task, handlerConfig, viewPath, notificationConfig) {
	console.log('email is called');
	return new Promise(function (resolve, reject) {
		async.parallel({
			text: function text(cb) {
				templateLoader(path.join(viewPath, task.handler, 'email', 'body.text.ejs'), cb);
			},
			html: function html(cb) {
				templateLoader(path.join(viewPath, task.handler, 'email', 'body.html.ejs'), cb);
			}
		}, function (err, templates) {
			console.log('got those templates');
			var transporter = nodemailer.createTransport(notificationConfig.adapters.email.transportString);

			var to = task.key;
			var prefix = '';
			if (task.user.firstName) {
				prefix = task.user.firstName;
				if (task.user.lastName) {
					prefix += ' ' + task.user.lastName;
				}
			}

			if (prefix) {
				to = prefix + '<' + to + '>';
			}
			var params = {
				from: handlerConfig.from,
				to: to,
				subject: _.template(handlerConfig.subject)(task)
			};

			if (templates.text) {
				params.text = templates.text(task);
			}
			if (templates.html) {
				params.html = templates.html(task);
			}

			console.log(1, templates);
			if (!templates.text && !templates.html) {
				return reject('No template found');
			}
			console.log(2);

			console.log('do that send...');
			transporter.sendMail(params, function (error, info) {
				if (error) {
					return reject(error);
				}
				resolve(info);
			});
		});
	});
};