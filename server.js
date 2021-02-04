const http = require('http')
require('dotenv').config()

const { getUsers, getUser, createUser, updateUser, deleteUser} = require('./controllers/userController')
const { getTransactionById, getTransactionByYearMonth, getBalanceByYearMonthUser, createTransactions } = require('./controllers/transactionController')
const { login } = require('./controllers/auth')

const server = http.createServer((req, res) => {
	if (req.url === '/api/users' && req.method === 'GET') {
		getUsers(req, res)
    } else if ( req.url.match(/\/api\/users\/([a-zA-Z0-9]+)/) && req.method === 'GET' ) {
		const id = req.url.split('/')[3]
		getUser(req, res, id)
    } else if (req.url === '/api/users' && req.method === 'POST') {
		createUser(req, res)
    } else if ( req.url.match(/\/api\/users\/([a-zA-Z0-9]+)/) && req.method === 'PATCH' ) {
		const id = req.url.split('/')[3]
		updateUser(req, res, id)
    } else if ( req.url.match(/\/api\/users\/([a-zA-Z0-9]+)/) && req.method === 'DELETE' ) {
		const id = req.url.split('/')[3]
		deleteUser(req, res, id)
    } else if ( req.url.match(/\/api\/transactions\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/) && req.method === 'GET' ) {
		const year = req.url.split('/')[3];
		const month = req.url.split('/')[4];
		const userId = req.url.split('/')[5];
		getBalanceByYearMonthUser(req, res, year, month, userId);
    } else if ( req.url.match(/\/api\/transactions\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/) && req.method === 'GET' ) {
		const year = req.url.split('/')[3];
		const month = req.url.split('/')[4];
		getTransactionByYearMonth(req, res, year, month);
	} else if ( req.url.match(/\/api\/transactions\/([a-zA-Z0-9]+)/) && req.method === 'GET' ) {
		const id = req.url.split('/')[3];
		getTransactionById(req, res, id);
    } else if (req.url === '/api/transactions' && req.method === 'POST') {
		createTransactions(req, res)
    } else if ( req.url.match(/\/api\/transactions\/([a-zA-Z0-9]+)/) && req.method === 'PATCH' ) {
		const id = req.url.split('/')[3]
		updateTransactions(req, res, id)
    } else if ( req.url.match(/\/api\/transactions\/([a-zA-Z0-9]+)/) && req.method === 'DELETE' ) {
		const id = req.url.split('/')[3]
		deleteTransactions(req, res, id)
	} else if (req.url === '/api/login' && req.method === 'POST') {
		login(req, res);
	} else {
		res.writeHead(404,{'Content-Type':'application/json'})
		res.end(JSON.stringify({message: 'Route Not Found'}))
    }
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server started on ${PORT}`))

