module.exports = {
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'alarner',
		password: '',
		database: 'test',
		charset: 'utf8'
	},
	migrations: {
		tableName: 'migrations'
	}
};