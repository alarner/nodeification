let expect = require('chai').expect;
describe('addSubscriber', function() {
	let errors = require('../errors');
	

	beforeEach(function() {
		let truncate = ['subscribers', 'subscriptions'];
		return Promise.all(truncate.map(table => {
			return global.knex.truncate(table);
		}));
	});

	describe('params', function() {
		it('should throw an error if no type is passed in', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber(); }).to.throw(/A \(string\) type must be passed as the first argument to addSubscriber\./);
		});
		it('should throw an error if no key is passed in', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email'); }).to.throw(/A \(string\) key must be passed as the second argument to addSubscriber\./);
		});
		it('should throw an error if a non-array subscriptions argument is passed in', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', null, 'foo'); }).to.throw(/addSubscriber subscriptions argument must be an array of strings./);
		});
		it('should throw an error if an array of non-strings subscriptions argument is passed in', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', null, [1, 2, 3]); }).to.throw(/addSubscriber subscriptions argument must be an array of strings./);
			expect(function() { addSubscriber('email', 'test@test.com', null, ['1', '2', 3]); }).to.throw(/addSubscriber subscriptions argument must be an array of strings./);
		});
		it('should work if arguments are valid 1', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com'); }).not.to.throw();
		});
		it('should work if arguments are valid 2', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', 15); }).not.to.throw();
		});
		it('should work if arguments are valid 3', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', 15, null); }).not.to.throw();
		});
		it('should work if arguments are valid 4', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', 15, []); }).not.to.throw();
		});
		it('should work if arguments are valid 5', function() {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			expect(function() { addSubscriber('email', 'test@test.com', 15, ['a', 'b', 'c']); }).not.to.throw();
		});
	});
	describe('other', function() {
		it('should store subscriber in the database if only a type and a key are specified', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			let Subscribers = require('../lib/collections/Subscribers')(bookshelf);

			Promise.all([
				addSubscriber('email', 'test@test.com'),
				addSubscriber('text', '5551231234'),
				addSubscriber('android-push', '4n9pc5q38ny5cw49'),
				addSubscriber('ios-push', '4n9pc5q38ny5cw49')
			])
			.then(result => {
				let s = new Subscribers();
				s.count().then(count => {
					expect(count).to.equal(4);
					done();
				})
				.catch(done);
			});
		});

		it('should store subscriber with user id in the database if a user id is specified', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			let Subscriber = require('../lib/models/Subscriber')(bookshelf);

			addSubscriber('email', 'test@test.com', 73)
			.then(s => {
				Subscriber.forge({id: s.id}).fetch().then(s => {
					expect(s.get('userId')).to.equal(73);
					done();
				})
				.catch(done);
			});
		});

		it('should store subscriptions if any are specified', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});

			addSubscriber('email', 'test@test.com', null, ['subscription/1', 'subscription/2', 'subscription/3'])
			.then(s => {
				s.subscriptions().fetch().then(subscriptions => {
					let descriptors = subscriptions.map(s => s.get('descriptor'));
					expect(descriptors.length).to.equal(3);
					expect(descriptors.indexOf('subscription/1')).to.be.gte(0);
					expect(descriptors.indexOf('subscription/2')).to.be.gte(0);
					expect(descriptors.indexOf('subscription/3')).to.be.gte(0);
					done();
				});
			})
			.catch(done);
		});
	});
});