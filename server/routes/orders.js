const router = require("express").Router();
const {
    findAll,
    add,
    findOne,
    update,
    deleteOne,
    findAllForCurrentUser,
    findOrderForCurrentUser,
    addOrderForCurrentUser,
    deleteAll
} = require("../controllers/order.controller");
const checkToken = require("../middleware/checkToken");
const checkAdmin = require("../middleware/checkAdmin");

router
    .use(checkToken);

router
    .route("/my/:order_id")
    .get(findOrderForCurrentUser);

router
    .route("/my")
    .get(findAllForCurrentUser)
    .post(addOrderForCurrentUser);

router
    .route("/:id")
    .get(checkAdmin, findOne)
    .put(checkAdmin, update)
    .delete(checkAdmin, deleteOne);

router
    .route("/")
    .get(checkAdmin, findAll)
    .post(checkAdmin, add)
    .delete(checkAdmin, deleteAll);

module.exports = router;