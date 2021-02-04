const { pool } = require('../data/pg_pool.js')
const { uuid } = require('uuidv4')


async function getTransactionById(id) {
	return new Promise (async (resolve, reject) => {
		db = await pool.connect();
		await db.query(`
			SELECT 
			  id, transaction_date, transaction_type, description,
			  charge, deposit, notes, created_on,
			  user_id
			FROM
				transactions
			WHERE 
				id = $1
			`,
			[id],
		    (error, result) => {
				if (error) {
					db.release();
					reject(error);
					return;
				}
				console.log(result.rows[0]);
				db.release()
				resolve(result.rows[0]);
			});
		});
}


async function getTransactionsByYearMonth(year, month) {
	return new Promise (async (resolve, reject) => {
		const startDate = `${year}-${month}-01`;
		if (month === 12) {
			month = 0
			year = Number(year) + 1
		}else{
			month = Number(month) + 1
		}
		const endDate = `${year}-${month}-01`;
		db = await pool.connect();
		await db.query(`
			SELECT 
			  id, transaction_date, transaction_type, description,
			  charge, deposit, notes, created_on,
			  user_id
			FROM
				transactions
			WHERE 
				transaction_date > $1 
				AND
				transaction_date < $2 
			`,
			[startDate, endDate],
		    (error, result) => {
				if (error) {
					db.release();
					console.log(error)
					reject('Invalid Input');
					return;
				}
				db.release();
				resolve(result.rows);
			});
	});

}

async function getBalanceByYearMonthUser(year, month, userId) {
	return new Promise (async (resolve, reject) => {
		const startDate = `${year}-${month}-01`;
		if (month === 12) {
			month = 0
			year = Number(year) + 1
		}else{
			month = Number(month) + 1
		}
		const endDate = `${year}-${month}-01`;

		db = await pool.connect();
		await db.query(`
			SELECT 
			  id, transaction_date, transaction_type, description,
			  charge, deposit, notes, created_on,
			  user_id
			FROM
				transactions
			WHERE 
				transaction_date > $1 
				AND
				transaction_date < $2
				AND
				user_id = $3
			`,
			[startDate, endDate, userId],
		    (error, result) => {
				if (error) {
					db.release();
					reject(error);
					return;
				}
				db.release();
				resolve(result.rows);
				return;
		});
	});
}


async function create(transaction) {
	return new Promise(async (resolve, reject) => {
		try {
			const newTransaction = {id: uuid(), ...transaction}
			const db = await pool.connect();
			await db.query(`
				INSERT INTO transactions
				(id, transaction_date, transaction_type, description,
				 charge, deposit, notes, created_on,
				 user_id)
				VALUES	
				($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
				[
				newTransaction.id,
				newTransaction.transactionDate,
				newTransaction.transactionType,
				newTransaction.description,
				newTransaction.charge,
				newTransaction.deposit,
				newTransaction.notes,
				newTransaction.createdOn,
				newTransaction.userId], (error, result) => {
				 if (error) {
					console.log(error) 
					reject(error)
				 }
				});
			db.release();
			resolve(newTransaction)
		} catch(error) {
		   console.log(error) 
		   reject(error)
		}
    })

}

async function update(transaction, id) {
	return new Promise(async (resolve, reject) => {
		try {
			const updateTransaction = {id: id, ...transaction}
			const db = await pool.connect();
			await db.query(`
				UPDATE transactions
				SET
					transaction_date = $1, 
					transaction_type = $2, 
					description = $3,
					charge = $4, 
					deposit = $5, 
					notes = $6, 
					created_on = $7,
					user_id = $8,
				WHERE
					id = $9
				`
				[updateTransaction.transaction_date,
				updateTransaction.transaction_type,
				updateTransaction.description,
				updateTransaction.charge,
				updateTransaction.deposit,
				updateTransaction.notes,
				updateTransaction.created_on,
				updateTransaction.user_id ,
				updateTransaction.id], (error, result) => {
				 if (error) {
					console.log(error) 
					reject(error)
				 }
				});
			db.release();
			resolve(updateTransaction)
		} catch(error) {
		   console.log(error) 
		   reject(error)
		}
    })

}

async function deleteTransaction(id) {
	return new Promise (async (resolve, reject) => {
		db = await pool.connect();
		await db.query(`
			DELETE 
			FROM
				transactions
			WHERE 
				id = $1
			`,
			[id],
		    (error, result) => {
				if (error) {
					db.release();
					reject(error);
				}
				return;
			});
		db.release();
		resolve(true);
	});
}

module.exports = {
	getTransactionById,
	getTransactionsByYearMonth,
	getBalanceByYearMonthUser,
	create,
	update,
	deleteTransaction,
}
