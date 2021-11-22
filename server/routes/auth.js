const {
    login,
    signup,
    refreshToken
} = require("../controllers/auth.controller");
const router = require("express").Router();

router
    .route("/login/")
    .post(login)

router
    .route("/signup/")
    .post(signup)

router
    .route("/refresh-token/")
    .post(refreshToken)

module.exports = router;