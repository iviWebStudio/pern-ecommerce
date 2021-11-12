const router = require("express").Router();
const {
    findAll,
    add,
    findOne,
    update,
    deleteOne,
    findBySku,
    findByTitle,
    findAllByStatus,
} = require("../controllers/product.controller");
const checkToken = require("../middleware/checkToken");
const checkAdmin = require("../middleware/checkAdmin");

router
    .route("/")
    .get(findAll)
    .post(checkToken, checkAdmin, add);

router
    .route("/:id")
    .get(findOne)
    .get(findBySku)
    .get(findByTitle)
    .put(checkToken, checkAdmin, update)
    .delete(checkToken, checkAdmin, deleteOne);

router.route("/status/:status")
    .get(findAllByStatus);


module.exports = router;