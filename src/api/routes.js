const express   = require("express");
const Users     = require("./users/auth");
const { validateToken } = require("../config/lib/tokenUtils");
const account   = express.Router();
const router    = express.Router();

router.use(validateToken);
account.route("/who").get((req, res) => {
    res.send({
        message: "Welcome to covevaults"
    })
});
account.route("/signup").post(Users.signup);
account.route("/signin").post(Users.signin);
router.route("/whoami").post(Users.whoami);



module.exports = {
    account,
    router
}