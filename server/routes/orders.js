const router = require("express").Router();
const {
    findAll,
    add,
    findOne,
    update,
    deleteOne,
    findAllForCurrentUser,
    findAllByUserId,
    findAllByStatus
} = require("../controllers/order.controller");
const checkToken = require("../middleware/checkToken");
const checkAdmin = require("../middleware/checkAdmin");

router
    .route("/")
    .get(checkToken, findAll)
    .post(checkToken, add);

router
    .route("/:id")
    .get(findOne)
    .put(update)
    .delete(deleteOne);

router
    .route("/userid")
    .get(checkAdmin, findAllByUserId);

router
    .route("/my")
    .get(checkToken, findAllForCurrentUser);

router
    .route("/status/:status")
    .get(checkAdmin, findAllByStatus);

module.exports = router;