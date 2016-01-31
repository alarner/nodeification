let expect = require('chai').expect;
let nodeification = require('../index');
describe('nodeification', function() {
	describe('options', function() {
		it('should work when passing in a knex db client', function() {
			let options = {
				knex: global.knex,
				viewPath: 'view/notification'
			};
			expect(function() { nodeification(options); }).not.to.throw();
		});
		it('should work when passing in a knex db connection params', function() {
			let options = {
				knex: {
					client: 'pg',
					connection: {
						host: '127.0.0.1',
						user: 'alarner',
						password: '',
						database: 'test',
						charset: 'utf8'
					}
				},
				viewPath: 'view/notification'
			};
			expect(function() { nodeification(options); }).not.to.throw();
		});
		it('should not work when knex option is missing', function() {
			let options = {
				viewPath: 'view/notification'
			};
			expect(function() { nodeification(options); }).to.throw(/A knex property must be passed with your options\./);
		});
		it('should not work when viewPath option is missing', function() {
			let options = {
				knex: global.knex
			};
			expect(function() { nodeification(options); }).to.throw(/A viewPath property must be passed with your options\./);
		});
	});
	describe('functionality', function() {
		let options = {
			knex: {
				client: 'pg',
				connection: {
					host: '127.0.0.1',
					user: 'alarner',
					password: '',
					database: 'test',
					charset: 'utf8'
				}
			},
			viewPath: 'view/notification'
		};
		let n = nodeification(options);
		it('should have addSubscriber method', function() {
			expect(n.addSubscriber).not.to.be.undefined;
		});
		it('should have subscribe method', function() {
			expect(n.subscribe).not.to.be.undefined;
		});
		it('should have unsubscribe method', function() {
			expect(n.unsubscribe).not.to.be.undefined;
		});
		it('should have send method', function() {
			expect(n.send).not.to.be.undefined;
		});
	});
});