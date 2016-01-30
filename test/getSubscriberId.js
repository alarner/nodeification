let expect = require('chai').expect;
let errors = require('../errors');
let gsi = require('../lib/getSubscriberId');
let getSubscriberId = null;
let Subscriber = null;
describe('getSubscriberId', function() {
	before(function() {
		let bookshelf = require('bookshelf')(global.knex);
		getSubscriberId = gsi({
			errors: errors,
			knex: global.knex,
			bookshelf: bookshelf
		});
		Subscriber = require('../lib/models/Subscriber')(bookshelf);
	
		return global.knex.truncate('subscribers').then(() => {
			return Subscriber.forge({
				type: 'email',
				key: 'anlarner@gmail.com',
				userId: 3
			}).save();
		});
	});

	describe('arguments', function() {
		it('should throw an error if no function is passed in', function() {
			expect(function() { getSubscriberId(); }).to.throw(/A function must be passed as the first argument to getSubscriberId\./);
		});
	});

	describe('functionality', function() {
		it('should return a function', function() {
			expect(getSubscriberId(() => {})).to.be.a('function');
		});

		it('should maintain the arguments if an integer is passed in first', function(done) {
			let args = [1, 'a', 'b', 'c'];
			getSubscriberId(function() {
				expect(Array.prototype.slice.call(arguments, 0)).to.deep.equal(args);
				done();
			}).apply(null, args);
		});

		it('should return an error if there are invalid arguments', function(done) {
			let args = ['a', 1, 'b', 'c'];
			getSubscriberId(function() {})
			.apply(null, args)
			.catch(err => {
				expect(err.toString()).to.equal('Invalid type/key or subscriberId.');
				done();
			});
		});

		it('should return an error if there is no matching subscriber', function(done) {
			let args = ['a', 'b', 'b', 'c'];
			getSubscriberId(function() {})
			.apply(null, args)
			.catch(err => {
				expect(err.toString()).to.equal('There is no subscriber with a type of "a" and a key of "b".');
				done();
			});
		});

		it('should return the subsriber id if the subsriber exists', function(done) {
			let args = ['email', 'anlarner@gmail.com', 'b', 'c'];
			getSubscriberId(function() {
				expect(Array.prototype.slice.call(arguments, 0)).to.deep.equal([1, 'b', 'c']);
				done();
			})
			.apply(null, args);
		});
	});
});