const mongoose  = require("mongoose");

const db = mongoose.createConnection("mongodb+srv://antan:Antan123@cluster0.yburj5r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    dbName: 'auth'
});

module.exports = db;