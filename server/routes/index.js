const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const product = require("./products");
const order = require("./orders");

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", product);
router.use("/orders", order);

module.exports = router;