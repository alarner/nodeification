'use strict';

var _ = require('lodash');
var fs = require('fs');
var templates = {};
module.exports = function (path, cb) {
	if (templates.hasOwnProperty(path)) {
		return cb(null, templates[path]);
	}
	fs.readFile(path, function (err, data) {
		if (err && err.code !== 'ENOENT') {
			return cb(err);
		}
		templates[path] = _.template(data);
		return cb(null, templates[path]);
	});
};