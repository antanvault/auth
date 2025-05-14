const mongoose  = require('mongoose');
const db        = require("../config/host");

const users = new mongoose.Schema({
    storage_id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    date_of_birth: String,
    gender: String,
    email: String,
    phone: String,
    salt: String,
    hash: String,
    role: {type: Number, default: 1},
    status: {type: Boolean, default: true},
    flag: {type: Boolean, default: true},
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

module.exports = db.model("users", users);