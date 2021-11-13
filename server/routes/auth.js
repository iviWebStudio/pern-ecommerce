const {
    login
} = require("../controllers/auth.controller");
const router = require("express").Router();

router
    .route("/")
    .get(login)

module.exports = router;