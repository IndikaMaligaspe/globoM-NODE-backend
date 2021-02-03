const users = require('../data/users')
const { pool } = require('../data/pg_pool.js')
const { uuid } = require('uuidv4')
const { writeDataToFile } = require('../utils.js')

async function findAll(){
	return new Promise(async (resolve, reject) => {
		const db = await pool.connect();
		const user = await db.query(
		`SELECT id, first_name, last_name, email, is_active, created_on
		 FROM users
		`,
		(error, result) => {
			if (error) {
				console.log(error);
				reject(error)
		    }else{
				db.release();
				resolve(result.rows);
			}
		 }
		);
    }) 
}

async function findById(id){
    return new Promise(async (resolve, reject) => {
		const db = await pool.connect();
		const user = await db.query(
		`SELECT id, first_name, last_name, email, is_active, created_on
		 FROM users
		 WHERE id = $1`,
		 [id],
		 (error, result) => {
			if (error) {
				console.log(error);
				reject(error)
		    }else{
				db.release();
				resolve(result.rows[0]);
			}
		 }
		);
    }) 
}

async function getUserByEmail(email, password=false){
    return new Promise(async (resolve, reject) => {

		const db = await pool.connect();
		let passwordCol = '';
		if (password) {
			passwordCol = 'password, ';
		}
		const user = await db.query(
		`SELECT id, first_name, last_name, ${passwordCol} email,is_active, created_on
		 FROM users
		 WHERE email = $1`,
		 [email],
		 (error, result) => {
			if (error) {
				console.log(error);
				reject(error)
		    }else{
				db.release();
				resolve(result.rows[0]);
			}
		 }
		);
    }) 
}

async function create(user) {
    return new Promise(async (resolve, reject) => {
	try {
	    const newUser = {id: uuid(), ...user}
		const db = await pool.connect();
		await db.query(`
			INSERT INTO users 
			(id, first_name, last_name, email, password, is_active, created_on)
			VALUES	
			($1, $2, $3, $4, $5, $6, $7)`, 
			[newUser.id,
			newUser.firstName,
			newUser.lastName,
			newUser.email,
			newUser.password,
			newUser.isActive,
			newUser.createdOn], (error, result) => {
			 if (error) {
				console.log(error) 
			    reject(error)
			 }
			});
		db.release();
        resolve(newUser)
	} catch(error) {
	   console.log(error) 
	   reject(error)
	}
    })
}

async function update(user, id) {
    return new Promise(async (resolve, reject) => {
	try {
	    const updatedUser = {id, ...user}
		console.log(updatedUser);
        const db = await pool.connect();
		await db.query(`
			UPDATE  users
			SET
				first_name = $1,
				last_name = $2, 
				email = $3, 
				is_active = $4, 
				created_on = $5
			WHERE 
				id = $6
			`, 
			[updatedUser.firstName,
			updatedUser.lastName,
			updatedUser.email,
			updatedUser.isActive,
			updatedUser.createdOn,
			updatedUser.id], 
			(error, result) => {
			 if (error) {
				console.log(error) 
			    reject(error)
			 } else {
				db.release(); 
				resolve(updatedUser); 
			 }
			});

	} catch(error) {
	   console.log(error) 
	   reject(error)
	}
    })
}

function deleteUser(id) {
    return new Promise(async (resolve, reject) => {
		const db = await pool.connect();
		const user = await db.query(
		`DELETE 
		 FROM users
		 WHERE id = $1`,
		 [id],
		 (error, result) => {
			if (error) {
				console.log(error);
				reject(error)
		    }else{
				db.release();
				resolve(result.rows[0]);
			}
		 }
		);
    }) 
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteUser,
	getUserByEmail,
}
