const jwt = require('jsonwebtoken');
//const { getHeaders } = require('../utils.js');
const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(req, res) {
	const { headers } =  req;
    let status = false;
	let token = headers['authorization']
	
	if(!token) {
		
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({auth:false, message: 'No token provided. '}));
		return status;
	}
	
	token = token.split(' ')[1];
	jwt.verify(token, SECRET_KEY, ((err, decoded) => {
		if (err) {
		    res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({auth:false, message: 'Failed to authenticate token. '}));
			return status;
		}
		res.writeHead(200,{userId: decoded.id});
		status = true;
	}))
	return status;
}

module.exports = {
	verifyToken
}
