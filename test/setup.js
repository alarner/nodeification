before(function() {
	global.knex = require('knex')({
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'alarner',
			password: '',
			database: 'test',
			charset: 'utf8'
		}
	});
});

