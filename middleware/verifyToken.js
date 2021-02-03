const JWT = require('jsonwebtoken');
const { getHeaders } = requre('../utils.js');
const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
	const token = getHeaders(req);

	if(!token) {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({auth:false, message: 'No token provided. '}));
	}

	jwt.verify(token, SECRET_KEY, ((err, decoded) {
		if (err) {
		    res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({auth:false, message: 'Failed to authenticate token. '}));
		}
		req.writeHeader({userId: decoded.id});
		next();
	});
}

module.exports = {
	verifyToken;
}
