const transactions = require('../models/transacions')
const { getPostData, generateHash } = require ('../utils')
const { verifyToken }  = require('../middleware/verifyToken')

async function getTransactionById(req, res, id) {
	if ( !verifyToken(req, res)){
		return;
	}
    try{
		const transaction = await transactions.getTransactionById(id)
		if (!transaction) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({message:'Transaction not found !!'}));
		}else {
			res.writeHead(200, {'Content-Type':'application/json'});
			res.end(JSON.stringify(transaction));
		}
	}catch(error) {
		console.log(error)
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify(error));
	}
}

async function getTransactionByYearMonth(req, res, year, month) {
	if ( !verifyToken(req, res)){
		return;
	}
    try{
		const transactionArr = await transactions.getTransactionsByYearMonth(year, month)
		if (!transactions) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({message:'Transactions not found !!'}));
		}else {
			res.writeHead(200, {'Content-Type':'application/json'});
			res.end(JSON.stringify(transactionArr));
		}
	}catch(error) {
		console.log(error)
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify(error));
	}
}
async function getBalanceByYearMonthUser(req, res, year, month, userId) {
	if ( !verifyToken(req, res)){
		return;
	}
    try{
		const transactionArr = await transactions.getBalanceByYearMonthUser(year, month, userId)
		if (!transactions) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({message:'Transactions not found !!'}));
		}else {
			res.writeHead(200, {'Content-Type':'application/json'});
			res.end(JSON.stringify(transactionArr));
		}
	}catch(error) {
		console.log(error)
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify(error));
	}
}

async function createTransactions(req, res) {
	if ( !verifyToken(req, res)){
		return;
	}
	const data = await getPostData(req);
    const { transactionDate, transactionType, description, charge, deposit, notes, createdOn, userId } = JSON.parse(data);
	const transaction = {
		transactionDate, 
		transactionType, 
		description, 
		charge, 
		deposit, 
		notes, 
		createdOn, 
		userId 
	}
	const newTransaction = await transactions.create(transaction);
	if (!newTransaction) {
	    res.writeHead(400, {'Content-Type':'application/json'});
	    return res.end(JSON.stringify({message:'Transaction not Created !!'}));
	}else {
        res.writeHead(201, {'Content-Type':'application/json'});
   	    return res.end(JSON.stringify(newTransaction));
    }	 

}
async function updateTransactions(req, res, id)
{
	if ( !verifyToken(req, res)){
		return;
	}

	const transaction = await transactions.getTransactionById(id)
    if (!transaction) {
	    res.writeHead(404, {'Content-Type':'application/json'});
	    return res.end(JSON.stringify({message:'Transaction not found !!'}));

	}
	const data = await getPostData(req);
    const { transactionDate, transactionType, description, charge, deposit, notes, createdOn, userId } = JSON.parse(data);
	const _Transaction = {
		transactionDate: transactionDate || transaction.transaction_date, 
		transactionType: transactionType || transaction.transaction_type, 
		description: description || transaction.description, 
		charge: charge || transaction.charge, 
		deposit: deposit || transaction.deposit, 
		notes: notes || transaction.notes, 
		createdOn: createdOn || transaction.created_on, 
		userId : userId || transaction.user_id

	}
	const updatedTransaction = await transactions.update(_Transaction, id);
	if (!updatedTransaction){
	    res.writeHead(400, {'Content-Type':'application/json'});
	    return res.end(JSON.stringify({message:'Transaction not Updated !!'}));
	}else {
        res.writeHead(201, {'Content-Type':'application/json'});
   	    return res.end(JSON.stringify(updatedTransaction));
    }	 

}
async function deleteTransactionById(req, res, id) {
	if ( !verifyToken(req, res)){
		return;
	}
    try{
		const transaction = await transactions.deleteTransaction(id)
		if (!transaction) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({message:'Transaction not found !!'}));
		}else {
			res.writeHead(200, {'Content-Type':'application/json'});
			res.end(JSON.stringify(transaction));
		}
	}catch(error) {
		console.log(error)
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify(error));
	}
}


module.exports = {
	getTransactionById,
	getTransactionByYearMonth,
	getBalanceByYearMonthUser,
	createTransactions,
	updateTransactions,
	deleteTransactionById,
}

