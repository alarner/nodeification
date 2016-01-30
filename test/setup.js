before(function() {
	global.knex = require('knex')({
		client: 'sqlite3',
		connection: {
			filename: './test.db'
		}
	});
});

