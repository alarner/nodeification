let expect = require('chai').expect;
let s = require('../lib/send');
let send = null;
let add = require('../lib/addSubscriber');
let addSubscriber = null;
let errors = require('../errors');
let Route = require('url-pattern');
let path = require('path');
describe('send', function() {
	before(function() {
		let bookshelf = require('bookshelf')(global.knex);
		let options = {
			errors: errors,
			knex: global.knex,
			bookshelf: bookshelf,
			viewPath: path.join(__dirname, 'views', 'notifications'),
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
			parsedRoutes: [],
			concurrency: 300,
			batchSize: 300,
			hasUsers: false,
			adapters: {
				email: {
					transport: {
						service: 'SendGrid',
						auth: {
							user: 'info@orionstudiomadison.com',
							pass: 'QPXu5aj6'
						}
					}
				}
			}
		};

		options.routes.forEach(route => {
			options.parsedRoutes.push({
				route: new Route(route.pattern),
				handler: route.handler
			});
		});

		send = s(options);
		addSubscriber = add(options);
	});

	beforeEach(function() {
			let truncate = ['subscribers', 'subscriptions', 'unsubscriptions', 'notifications'];
			return Promise.all(truncate.map(table => {
				return global.knex(table).del();
			}));
		});

	it('should throw an error if there is no route', function(done) {
		send('newslettersss')
		.catch(err => {
			expect(err.toString()).to.equal('There is no matching handler for the descriptor "newslettersss"');
			done();
		});
	});

	it('should work', function(done) {
		addSubscriber('email', 'anlarner@gmail.com', null, ['recover-password/1'])
		.then(subscriber => send('recover-password/1'))
		.then(result => {
			console.log('done');
			console.log(result);
			done();
		});
	});
});