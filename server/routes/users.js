const {
    findAll,
    add,
    deleteOne,
    findOne,
    update,
    getProfile,
    findByLogin,
    findByEmail,
    findByRole
} = require("../controllers/user.controller");
const router = require("express").Router();
const checkAdmin = require("../middleware/checkAdmin");
const checkToken = require("../middleware/checkToken");

router
    .use(checkToken);

router
    .route("/")
    .get(checkAdmin, findAll)
    .post(checkAdmin, add);

router
    .route("/profile")
    .get(getProfile);

router
    .route("/:id")
    .get(findOne)
    .put(update)
    .delete(deleteOne);

router
    .route("/search")
    .get(checkAdmin, findByLogin)
    .get(checkAdmin, findByEmail);

router
    .route("/roles")
    .get(checkAdmin, findByRole);

module.exports = router;