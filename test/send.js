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

	it('should throw an error if there is no route', function(done) {
		send('newslettersss')
		.catch(err => {
			expect(err.toString()).to.equal('There is no matching handler for the descriptor "newslettersss"');
			done();
		});
	});
});