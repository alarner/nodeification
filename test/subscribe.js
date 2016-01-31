let expect = require('chai').expect;
let s = require('../lib/subscribe');
let subscribe = null;
let add = require('../lib/addSubscriber');
let addSubscriber = null;
let errors = require('../errors');
describe('subscribe', function() {
	describe('params', function() {
		before(function() {
			let bookshelf = require('bookshelf')(global.knex);
			subscribe = s({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber = add({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
		});

		beforeEach(function() {
			let truncate = ['subscribers', 'subscriptions'];
			return Promise.all(truncate.map(table => {
				return global.knex(table).del();
			}));
		});

		it('should throw an error if the descriptor is not a string', function(done) {
			subscribe(1, 7).catch(err => {
				expect(err.toString()).to.equal('"7" (type = number) is not a valid subscription descriptor.');
				done();
			});
		});

		it('should subscribe a user if the subscription doesn\'t already exist', function(done) {
			let s = null;
			addSubscriber('email', 'test@test.com')
			.then(subscriber => {
				s = subscriber;
				return subscribe(subscriber.id, 'test/foo/bar');
			})
			.then(subscription => {
				return s.subscriptions().fetch();
			})
			.then(subscriptions => {
				expect(subscriptions.length).to.equal(1);
				expect(subscriptions.at(0).get('descriptor')).to.equal('test/foo/bar');
				done();
			});
		});

		it('should not subscribe a user if the subscription already exists', function(done) {
			let s = null;
			addSubscriber('email', 'test@test.com')
			.then(subscriber => {
				s = subscriber;
				return subscribe(s.id, 'test/foo/bar');
			})
			.then(subscription => {
				return subscribe(s.id, 'test/foo/bar');
			})
			.catch(err => {
				expect(err.toString()).to.match(/\"test\/foo\/bar\" already exists for subscriber .*\./);
				done();
			});
		});

		it('should not subscribe a user if the subscriber doesn\'t exist', function(done) {
			subscribe(10, 'test/foo/bar')
			.catch(err => {
				expect(err.toString()).to.match(/The subscriber id .* does not match an existing record\./);
				done();
			});
		});
	});
});