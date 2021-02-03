const jwt = require('jsonwebtoken');

const users = require('../models/user');
const { getPostData, getFormPostData, generateHash, compareHash } = require ('../utils');


const SECRET_KEY = process.env.SECRET_KEY

function validateEmail(email) {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function validateUser(hashedPassword, password) {
  return compareHash(hashedPassword, password);
}

function getToken(user) {
	return jwt.sign({id: user.id, email: user.email }, 
		SECRET_KEY, 
		{expiresIn: 86400});
}

async function login(req, res) {
    try{
		const {email, password } = await getFormPostData(req);

		if (!validateEmail(email)) {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify('Invalid Email'));
		}
		const user = await users.getUserByEmail(email, true);

		if (!user) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify('Email is not registered'));
		} else if (!validateUser(user.password, password)) {
			res.writeHead(403, {'Content-Type':'application/json'});
			res.end(JSON.stringify('Invalid credentials provided'));
		} 
		const token  = getToken(user);
		res.writeHead(200, {'Content-Type':'application/json'});
		res.end(JSON.stringify({ auth: true, token: token, user: {id:user.id, email:user.email} }));
    }catch (error) {
    	res.writeHead(500, {'Content-Type':'application/json'})
    	res.end(JSON.stringify(error))
    }
}

module.exports  = {
	login
}

