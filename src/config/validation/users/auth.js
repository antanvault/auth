const Joi = require('joi');

module.exports.auth = {
    signup: Joi.object({
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        gender: Joi.string().required(),
        dob: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.number().required(),
        password : Joi.string().min(8).required().pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).messages({
            "string.pattern.base": "Password should be alpha numaric with special charcter"
        })
    }),
    signin : Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
}