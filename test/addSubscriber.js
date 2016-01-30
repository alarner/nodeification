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
});