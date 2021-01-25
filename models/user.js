const users = require('../data/users')
const { uuid } = require('uuidv4')
const { writeDataToFile } = require('../utils.js')

async function findAll(){
     return new Promise((resolve, reject) => {
	resolve(users)
     })
}

async function findById(id){
    return new Promise((resolve, reject) => {
	const user = users.find((user) => user.id === id)
	resolve(user)
    }) 
}

function create(user) {
    return new Promise((resolve, reject) => {
	try {
	    const newUser = {id: uuid(), ...user}
    	    users.push(newUser)
    	    writeDataToFile('data/users.json', users)
    	    resolve(newUser)
	} catch(error) {
	   console.log(error) 
	   reject(error)
	}
    })
}
module.exports = {
    findAll,
    findById,
    create
}
