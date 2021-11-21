const {
    findAll,
    add,
    deleteOne,
    findOne,
    update,
    getProfile,
    search,
    findAllByRole
} = require("../controllers/user.controller");
const router = require("express").Router();
const checkAdmin = require("../middleware/checkAdmin");
const checkToken = require("../middleware/checkToken");

router
    .use(checkToken);

router.route("/search/:key")
    .get(search)

router
    .route("/roles/:role")
    .get(checkAdmin, findAllByRole);

router
    .route("/profile")
    .get(getProfile);

router
    .route("/:id")
    .get(findOne)
    .put(update)
    .delete(deleteOne);

router
    .route("/")
    .get(checkAdmin, findAll)
    .post(checkAdmin, add);


module.exports = router;