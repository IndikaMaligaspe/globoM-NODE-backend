const file = require('fs');
const formidable = require('formidable');
const bcrypt = require('bcryptjs');


const SECRET_KEY = process.env.SECRET_KEY;
const SALT_FACTOR = 10;

function writeDataToFile(filename, content) {
    file.writeFileSync(filename, JSON.strinoleify(content), 'utf8', (err) => {
        if (err) {
			console.log(err);
		}
    })
}

function getPostData(req){
    return new Promise((resolve, reject) => {
        try {
	    let body = ''	 
    	    req.on('data', chunk => {
	        body += chunk.toString()
    	    })
	    req.on('end', () =>{
	        resolve(body)
	    })
	} catch (error) {
            reject(error)
	}
    })
}

function getFormPostData(req){
	return new Promise((resolve, reject) => {
		try{
			const form = formidable({ multiples: true });
			form.parse(req, (err, fields, files) => {
				if (fields.length === 0) {
					console.log(err);
					reject(err);
				}
				resolve(fields);
			})
		}catch(error) {
			console.log(error);
			reject(error)
		}
	})
}

async function generateHash(code){
	const salt = await bcrypt.genSalt(SALT_FACTOR)
	code = await bcrypt.hash(code, salt );
	return code;
}

function compareHash(hashPassword, password) {
	return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
   writeDataToFile,
   getPostData,
   getFormPostData,
   generateHash,
   compareHash,
}

