let expect = require('chai').expect;
let u = require('../lib/unsubscribe');
let unsubscribe = null;
let add = require('../lib/addSubscriber');
let addSubscriber = null;
let errors = require('../errors');
describe('unsubscribe', function() {
	before(function() {
		let bookshelf = require('bookshelf')(global.knex);
		let config = {
			errors: errors,
			knex: global.knex,
			bookshelf: bookshelf
		};
		unsubscribe = u(config);
		addSubscriber = add(config);
	});

	beforeEach(function() {
		let truncate = ['subscribers', 'subscriptions', 'unsubscriptions'];
		return Promise.all(truncate.map(table => {
			return global.knex(table).del();
		}));
	});

	it('should properly validate a non-string descriptor', function(done) {
		unsubscribe(7, 7)
		.catch(err => {
			expect(err.toString()).to.equal('"7" (type = number) is not a valid subscription descriptor.');
			done();
		});
	});

	it('should properly validate an empty descriptor', function(done) {
		unsubscribe(7, '')
		.catch(err => {
			expect(err.toString()).to.equal('"" (type = string) is not a valid subscription descriptor.');
			done();
		});
	});

	it('should not allow unsubscribing to non-existant subscriptions', function(done) {
		unsubscribe(7, 'test')
		.catch(err => {
			expect(err.toString()).to.equal('There is no subscription with a subscriberId of 7 and descriptor "test".');
			done();
		});
	});

	it('should unsubscribe properly when parameters are valid', function(done) {
		addSubscriber('email', 'test@test.com', null, ['test/foo'])
		.then(subscriber => {
			return unsubscribe(subscriber.id, 'test/foo');
		})
		.then(unsubscription => {
			expect(unsubscription.id).to.be.ok;
			done();
		});
	});
});