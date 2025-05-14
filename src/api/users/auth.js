const { genPassword, validPassword } = require("../../config/lib/passwordUtils");
const { genToken } = require("../../config/lib/tokenUtils");
const { v6: uuid } = require("uuid");
const crypto = require("crypto");
const { auth } = require("../../config/validation/users/auth");
const users = require("../../schema/users");
const session = require("../../schema/session");
const axios = require('axios');
const redis = require("redis");
const { default: mongoose } = require("mongoose");
const redisClient = redis.createClient({
    url: "redis://host.docker.internal:6379"
});

class Users {

    static async vaultUser(options = {}, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await axios.post(process.env.VAULT + "/signup", options);
                console.info(response);
                return response; // Return if the request succeeds
            } catch (error) {
                if (attempt === maxRetries) throw error; // Throw error if max retries are reached

                console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            }
        }
    }

    static async signup(req, res) {

        let { body } = req;

        let { error, value } = auth.signup.validate(body, { abortEarly: false });
        let { salt, hash } = genPassword(value.password);
        let storageId = new mongoose.Types.ObjectId();

        try {

            if (error) {
                res.send({
                    success: false,
                    message: "error!",
                    result: null,
                    error: {
                        error_status: true,
                        message: error.message
                    }
                });
            } else {
                if (await users.exists({ email: body.email }) !== null) {
                    res.send({
                        success: false,
                        message: "error!",
                        result: null,
                        error: {
                            error_status: true,
                            message: "email already exist"
                        }
                    });
                } else if (await users.exists({ phone: body.phone }) !== null) {
                    res.send({
                        success: false,
                        message: "error!",
                        result: null,
                        error: {
                            error_status: true,
                            message: "Phone number already exist"
                        }
                    });
                } else {
                    users.create({ storage_id: storageId, first_name: body.first_name, last_name: value.last_name, email: value.email, phone: body.phone, gender: value.gender, date_of_birth: value.dob, salt: salt, hash: hash }).then(async (response) => {

                        if (response) {

                            await Users.vaultUser({ _id: response._id, storage_id: storageId, first_name: body.first_name, last_name: body.last_name, email: body.email, phone: body.phone, gender: body.gender, date_of_birth: body.dob });

                            res.send({
                                success: false,
                                message: "account created sucessfuly",
                                result: {
                                    id: response._id
                                },
                                error: {
                                    error_status: false,
                                    message: null
                                }
                            });
                        }
                    })
                }
            }

        } catch (err) {
            res.send({
                result: {
                    success: false,
                    message: "error!"
                },
                error: {
                    error_status: true,
                    message: "Something went wrong please contact support@covevault.com"
                }
            });
        }


    }

    static async signin(req, res) {

        let { body } = req;
        let { error, value } = auth.signin.validate(body, { abortEarly: false });

        try {

            if (error) {
                res.send({
                    success: false,
                    message: "error!",
                    result: null,
                    error: {
                        error_status: true,
                        message: error.message
                    }
                });
            } else {
                users.findOne({ email: value.email }).then(async (response) => {
                    let { salt, hash } = response || {};
                    if (validPassword(value.password, hash, salt)) {

                        let userdata = { _id: response._id, storage_id: response.storage_id, first_name: response.first_name, last_name: response.last_name, email: response.email, role: response.role };

                        let tokenId = await genToken(userdata);
                        let salt = crypto.randomBytes(32).toString('hex');
                        let uuid = crypto.randomUUID();
                        let sessionId = crypto.pbkdf2Sync(uuid, salt, 10000, 16, 'sha256').toString('hex');

                        session.create({ user_id: response._id, token_id: tokenId, session_id: sessionId }).then((response) => {
                            if (response) {

                                redisClient.connect().then(async () => {
                                    await redisClient.set(sessionId, tokenId, { EX: 3600 });
                                    redisClient.quit();

                                    res.send({
                                        result: {
                                            success: true,
                                            message: "access allowed",
                                            session: sessionId,
                                        },
                                        error: {
                                            error_status: false,
                                            message: null
                                        }
                                    });

                                }).catch((err) => {
                                    res.send({
                                        result: {
                                            success: false,
                                            message: "error!"
                                        },
                                        error: {
                                            error_status: true,
                                            message: "please check your email or password"
                                        }
                                    });
                                });
                            }
                        })
                    } else {
                        res.send({
                            result: {
                                success: false,
                                message: "error!"
                            },
                            error: {
                                error_status: true,
                                message: "please check your email or password"
                            }
                        });
                    }


                })
            }
        } catch (err) {
            res.send({
                result: {
                    success: false,
                    message: "error!"
                },
                error: {
                    error_status: true,
                    message: "Something went wrong please contact support@cedruz.com"
                }
            });
        }
    }

    static async whoami(req, res) {
        res.send(req.user);
    }

}

module.exports = Users;