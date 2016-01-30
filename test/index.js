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
					client: 'sqlite3',
					connection: {
						filename: './test.db'
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
});