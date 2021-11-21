const {ErrorHandler} = require("../helpers/error");

const checkAdmin = (req, res, next) => {
    const {isAdmin} = req.user;
    if (isAdmin) {
        req.user = {
            ...req.user,
            isAdmin: true,
        };
        return next();
    } else {
        throw new ErrorHandler(401, "Unauthorized admin.");
    }
};

module.exports = checkAdmin