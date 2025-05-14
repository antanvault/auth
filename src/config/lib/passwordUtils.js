const crypto = require("crypto");

const genPassword = (password) => {
    let salt = crypto.randomBytes(32).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');

    return {
        salt,
        hash
    }
}

const validPassword = (password, hash, salt) => {
    let verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
    return hash === verifyHash;
}

module.exports = {
    genPassword,
    validPassword
}