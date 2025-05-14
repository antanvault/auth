const express       = require("express");
const cors          = require("cors");
const limit         = require('express-rate-limit');
                      require("dotenv").config();
                      
const { account, router } = require("./src/api/routes");
                      

const app = express();



// var allowdomain = ['http://localhost:3000']
// const corsvalidate = (req, callback) => {
//     var crosorigin;
//     if (allowdomain.indexOf(req.header('Origin')) !== -1) {
//         crosorigin = { origin: true } 
//     } else {
//         crosorigin = { origin: false } 
//     }
//     callback(null, crosorigin);
// }

const limiter = limit.rateLimit({
	windowMs: 5 * 60 * 1000,
	limit: 10,
})

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(account);
app.use(router);


app.listen(process.env.PORT, () => {
    console.log(`Server [${process.env.PORT}] [${process.pid}] connected...`);
});

