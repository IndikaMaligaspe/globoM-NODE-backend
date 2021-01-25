const users = require('../models/user')
const { getPostData } = require ('../utils')

async function getUsers(req, res) {
    try{
	const response = await users.findAll()
    	res.writeHead(200, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(response))
    }catch (error) {
    	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(err))
    }
}

async function getUser(req, res, id ) {
    try{
	const user = await users.findById(id)
	if (!user) {
	    res.writeHead(404, {'Content-Type':'application/json'})
	    res.end(JSON.stringify({message:'User not found !!'}))
	}else {
	    res.writeHead(200, {'Content-Type':'application/json'})
    	    res.end(JSON.stringify(user))
	}

    }catch(error) {
     	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(err))
    }
}

async function createUser(req, res) {
     try{
             const data = await getPostData(req)
	     const { firstName, secondName, email, password, isActive, createdOn } = JSON.parse(data)
	     const user = {
         	firstName,
	 	secondName,
	 	email,
	 	password,
	 	isActive,
	 	createdOn
	     }
	     const newUser = await users.create(user)
	     if (!newUser) {
	         res.writeHead(400, {'Content-Type':'application/json'})
	         return res.end(JSON.stringify({message:'User not Created !!'}))
	     }else {
	         res.writeHead(201, {'Content-Type':'application/json'})
    	         return res.end(JSON.stringify(newUser))
	     }
     	 
    
     }catch (error) {
	 console.log(error)
         res.writeHead(500, {'Content-Type':'application/json'})
	 res.end(JSON.stringify({message: error}))
    
     }
}

module.exports  = {
   getUsers,
   getUser,
   createUser
}
 
