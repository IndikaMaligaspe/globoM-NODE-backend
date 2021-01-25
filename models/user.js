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

function update(user, id) {
    return new Promise((resolve, reject) => {
	try {
	    const updatedUser = {id, ...user}
	    const index  = users.findIndex((user) => user.id === id)
	    users[index] = updatedUser
    	    writeDataToFile('data/users.json', users)
    	    resolve(updatedUser)
	} catch(error) {
	   console.log(error) 
	   reject(error)
	}
    })
}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
	try {
	    // Can also use users = users.filter((user) => users.id != id)
	    const index = users.findIndex((user) => user.id === id)
	    users.splice(index,1)
    	    writeDataToFile('data/users.json', users)
    	    resolve(true)
	} catch(error) {
	   console.log(error) 
	   reject(error)
	}
    })
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteUser,
}
