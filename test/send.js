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
				},
				{
					pattern: 'message',
					handler: 'message'
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
				},
				'push-android': {
					key: '...'
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

	// it('should work for email', function(done) {
	// 	addSubscriber('email', 'test@test.com', null, ['recover-password/1'])
	// 	.then(subscriber => send('recover-password/1'))
	// 	.then(result => {
	// 		console.log('done');
	// 		console.log(result);
	// 		done();
	// 	});
	// });

	// it('should work for push-android', function(done) {
	// 	addSubscriber('push-android', 'cUYZOIDqNRM:APA91bEgpokNIZK2hkjh4dmX7uBrgH5AUB266ZMm49KFHrbTGvY99izZ7D5ukJ9j5w-YP1_8c41moFvmk0YEViQOL211q35iEmfn6OzM-o89h3V8zsYsc0W-56DkiisUbvSQtUo1pLHU', null, ['message'])
	// 	.then(subscriber => send('message', {message: 'You are an awesome person!'}))
	// 	.then(result => {
	// 		console.log('done');
	// 		console.log(result);
	// 		done();
	// 	})
	// 	.catch(err => {
	// 		console.log(err.params());
	// 	});
	// });
});