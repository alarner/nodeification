let babel = require('babel-core');
let fs = require('fs');
let async = require('async');
let path = require('path');
let files = [
	'index.js',
	'errors.js',
	'migrations/notifications.js',
	'lib/error-handlers/subscriber.js',
	'lib/models/Subscriber.js',
	'lib/addSubscriber.js'
];

async.each(
	files,
	convertFile,
	function(err) {
		console.log('finished', err);
	}
);


function convertFile(filepath, cb) {
	babel.transformFile(path.join(__dirname, '../', filepath), function(err, result) {
		if(err) return cb(err);
		fs.writeFile(path.join(__dirname, '../dist', filepath), result.code, cb);
	});
}