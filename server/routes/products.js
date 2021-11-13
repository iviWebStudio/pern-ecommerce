const router = require("express").Router();
const {
    findAll,
    add,
    findOne,
    update,
    deleteOne,
    search,
    findAllByStatus,
    deleteAll,
} = require("../controllers/product.controller");
const checkToken = require("../middleware/checkToken");
const checkAdmin = require("../middleware/checkAdmin");

router.route("/search")
    .get(search)

router.route("/status")
    .get(findAllByStatus);
router.route("/status/:status")
    .get(findAllByStatus);

router
    .route("/:id/")
    .get(findOne)
    .put(checkToken, checkAdmin, update)
    .delete(checkToken, checkAdmin, deleteOne);

router
    .route("/")
    .get(findAll)
    .post(checkToken, checkAdmin, add)
    .delete(checkToken, checkAdmin, deleteAll);


module.exports = router;