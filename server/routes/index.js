const router = require("express").Router();
const order = require("./orders");
const product = require("./products");
const users = require("./users");
const auth = require("./auth");

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", product);
router.use("/orders", order);

module.exports = router;