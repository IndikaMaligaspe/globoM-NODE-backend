const { Pool } = require ('pg')

console.log("user =>", process.env.DB_UN);
const pool =  new Pool (
	{
		user: process.env.DB_UN,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PW,
		port: process.env.DB_PORT,
	}
)

module.exports = {
	pool,
}
