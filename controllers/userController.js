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
	console.log(error)
     	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(error))
    }
}

async function createUser(req, res) {
	try{
		const data = await getPostData(req)
		const { firstName, lastName, email, password, isActive, createdOn } = JSON.parse(data)
	     
		const user = {
			firstName,
			lastName,
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
		res.writeHead(500, {'Content-Type':'application/json'})
		res.end(JSON.stringify({message: error}))
    
    }
}

async function updateUser(req, res, id){
    try{
	const user = await users.findById(id)
	if (!user) {
	    res.writeHead(404, {'Content-Type':'application/json'})
	    res.end(JSON.stringify({message:'User not found !!'}))
	}else {
	     const data = await getPostData(req) 
	     const { firstName, lastName, email, password, isActive, createdOn } = JSON.parse(data)
	     const updateUser = {
		firstName: firstName || user.firstName,
	 	lastName: lastName|| user.lastName,
	 	email: email || user.email,
	 	password:password || user.password,
	 	isActive:isActive || user.isActive,
	 	createdOn:createdOn || user.creaedOn
	     }
	     const updatedUser = await users.update(updateUser, id)
	     if (!updatedUser) {
	         res.writeHead(400, {'Content-Type':'application/json'})
	         return res.end(JSON.stringify({message:'User not Updated !!'}))
	     }
             res.writeHead(200, {'Content-Type':'application/json'})
             return res.end(JSON.stringify(updatedUser))
	}
    }catch(error) {
	console.log('Error - >',error)
     	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(error))
    }

}

async function deleteUser(req, res, id){
    try{
	const user = await users.findById(id)
	if (!user) {
	    res.writeHead(404, {'Content-Type':'application/json'})
	    res.end(JSON.stringify({message:'User not found !!'}))
	}else {
	     await users.deleteUser(id)
             res.writeHead(200, {'Content-Type':'application/json'})
             return res.end(JSON.stringify({message: 'user deleted'}))
	}
    }catch(error) {
	console.log('Error - >',error)
     	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(error))
    }

}

module.exports  = {
   getUsers,
   getUser,
   createUser,
   updateUser,
   deleteUser,
}
 
