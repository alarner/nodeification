let expect = require('chai').expect;
describe('addSubscriber', function() {
	let errors = require('../errors');

	beforeEach(function(done) {
		let truncate = ['subscribers', 'subscriptions'];
		global.knex('subscribers').del()
		.then(() => {
			return global.knex('subscriptions').del();
		})
		.then(() => {
			return global.knex('subscribers').select('*');
		})
		.then((subscribers) => {
			done();
		});
	});

	describe('params', function() {

		it('should throw an error if no type is passed in', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber()
			.catch(err => {
				expect(err.toString()).to.equal('A (string) type must be passed as the first argument to addSubscriber.');
				done();
			});
		});
		it('should throw an error if no key is passed in', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email')
			.catch(err => {
				expect(err.toString()).to.equal('A (string) key must be passed as the second argument to addSubscriber.');
				done();
			});
		});
		it('should throw an error if a non-array subscriptions argument is passed in', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', null, 'foo')
			.catch(err => {
				expect(err.toString()).to.equal('addSubscriber subscriptions argument must be an array of strings.');
				done();
			});
		});
		it('should throw an error if an array of non-strings subscriptions argument is passed in', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', null, [1, 2, 3])
			.catch(err => {
				expect(err.toString()).to.equal('addSubscriber subscriptions argument must be an array of strings.');
				addSubscriber('email', 'test@test.com', null, ['1', '2', 3])
				.catch(err => {
					expect(err.toString()).to.equal('addSubscriber subscriptions argument must be an array of strings.');
					done();
				});
			});
		});
		it('should work if arguments are valid 1', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com')
			.then(s => {
				expect(s.get('type')).to.equal('email');
				expect(s.get('key')).to.equal('test@test.com');
				done();
			});
		});
		it('should work if arguments are valid 2', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', 15)
			.then(s => {
				expect(s.get('type')).to.equal('email');
				expect(s.get('key')).to.equal('test@test.com');
				expect(s.get('userId')).to.equal(15);
				done();
			});
		});
		it('should work if arguments are valid 3', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', 15, null)
			.then(s => {
				expect(s.get('type')).to.equal('email');
				expect(s.get('key')).to.equal('test@test.com');
				expect(s.get('userId')).to.equal(15);
				done();
			});
		});
		it('should work if arguments are valid 4', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', 15, [])
			.then(s => {
				expect(s.get('type')).to.equal('email');
				expect(s.get('key')).to.equal('test@test.com');
				expect(s.get('userId')).to.equal(15);
				done();
			});
		});
		it('should work if arguments are valid 5', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com', 15, ['a', 'b', 'c'])
			.then(s => {
				expect(s.get('type')).to.equal('email');
				expect(s.get('key')).to.equal('test@test.com');
				expect(s.get('userId')).to.equal(15);
				done();
			});
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
				addSubscriber('push-android', '4n9pc5q38ny5cw49'),
				addSubscriber('push-ios', '4n9pc5q38ny5cw49')
			])
			.then(result => {
				let s = new Subscribers();
				s.count().then(count => {
					expect(parseInt(count)).to.equal(4);
					done();
				});
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
				});
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
			});
		});

		it('should not allow the same user to subscribe twice', function(done) {
			let bookshelf = require('bookshelf')(global.knex);
			bookshelf.plugin('registry');
			let addSubscriber = require('../lib/addSubscriber')({
				errors: errors,
				knex: global.knex,
				bookshelf: bookshelf
			});
			addSubscriber('email', 'test@test.com')
			.then(s => {
				return addSubscriber('email', 'test@test.com', 7);
			})
			.catch(err => {
				expect(err.toString()).to.equal('A subscriber with type "email" and key "test@test.com" already exists.');
				done();
			});
		});
	});
});