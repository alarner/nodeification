module.exports = {
	client: 'sqlite3',
	connection: {
		filename: './test.db'
	},
	migrations: {
		tableName: 'migrations'
	}
};