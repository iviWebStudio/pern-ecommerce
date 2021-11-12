const {ErrorHandler} = require("../helpers/logger");

const checkAdmin = (req, res, next) => {
    const {role} = req.user;
    if (role && role.includes("admin")) {
        req.user = {
            ...req.user,
            role,
        };
        return next();
    } else {
        throw new ErrorHandler(401, "Unauthorized admin.");
    }
};

module.exports = checkAdmin