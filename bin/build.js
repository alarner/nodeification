let babel = require('babel-core');
let fs = require('fs');
let async = require('async');
let path = require('path');
let files = [
	'index.js',
	'errors.js',
	'lib/addSubscriber.js',
	'lib/getSubscriberId.js',
	'lib/send-task.js',
	'lib/send.js',
	'lib/subscribe.js',
	'lib/template-loader.js',
	'lib/unsubscribe.js',
	'lib/adapters/push-android.js',
	'lib/adapters/email.js',
	'lib/adapters/push-ios.js',
	'lib/adapters/text.js',
	'lib/collections/Subscribers.js',
	'lib/collections/Subscriptions.js',
	'lib/error-handlers/subscriber.js',
	'lib/error-handlers/subscription.js',
	'lib/error-handlers/unsubscription.js',
	'lib/models/Notification.js',
	'lib/models/Subscriber.js',
	'lib/models/Subscription.js',
	'lib/models/Unsubscription.js'
];

async.each(
	files,
	convertFile,
	function(err) {
		console.log('finished', err);
	}
);


function convertFile(filepath, cb) {
	let options = {presets: ['es2015']};
	babel.transformFile(path.join(__dirname, '../', filepath), options, function(err, result) {
		if(err) return cb(err);
		fs.writeFile(path.join(__dirname, '../dist', filepath), result.code, cb);
	});
}