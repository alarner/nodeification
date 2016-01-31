let expect = require('chai').expect;
let s = require('../lib/send');
let send = null;
let errors = require('../errors');
let Route = require('url-pattern');
describe('send', function() {
	before(function() {
		let bookshelf = require('bookshelf')(global.knex);
		let options = {
			errors: errors,
			knex: global.knex,
			bookshelf: bookshelf,
			routes: [
				{
					pattern: 'newsletter',
					handler: 'newsletter'
				},
				{
					pattern: 'recover-password/:id',
					handler: 'recover-password'
				},
				{
					pattern: 'notification/chat/:id',
					handler: 'chat-notification'
				}
			],
			parsedRoutes: []
		};

		options.routes.forEach(route => {
			options.parsedRoutes.push({
				route: new Route(route.pattern),
				handler: route.handler
			});
		});

		send = s(options);
	});

	it('should work', function() {
		expect(true).to.be.true;
	});
});