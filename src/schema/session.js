const mongoose  = require('mongoose');
const db        = require("../config/host");

const session = new mongoose.Schema({
    user_id: String,
    token_id: String,
    session_id: String,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

module.exports = db.model("session", session);