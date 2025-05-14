const jwt   = require("jsonwebtoken");
const fs    = require("fs");
const session = require("../../schema/session");
                require('dotenv').config({path: './.env'});



const genToken = async (userdata) => {
    var privateKey = fs.readFileSync(`${__dirname}\/secret.key`);
    let token  =  jwt.sign(userdata, privateKey, { algorithm: 'RS256', expiresIn: '1h'});
    return token;
}


const validateToken = async (req, res, next) => {
    if(req.headers['authorization']){
        let sessions = req.headers['authorization'];
        let {token_id} = await session.findOne({session_id: sessions}, {token_id:1});
        var privateKey = fs.readFileSync(`${__dirname}\/secret.key`);
        jwt.verify(token_id, privateKey, (err, user) => {
            if(err){ 
                res.status(403).send({message: 'Access Forbidden'}); 
            }else{
                req.user = user;
                next();
            }
        })
    }
}

module.exports = {
    genToken,
    validateToken
}