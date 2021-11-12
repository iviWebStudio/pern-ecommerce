const jwt = require("jsonwebtoken");
const {ErrorHandler} = require("../helpers/logger");

const checkToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        throw new ErrorHandler(401, "Token missing");
    }

    try {
        req.user = jwt.verify(token, process.env.SECRET);
        next();
    } catch (error) {
        throw new ErrorHandler(401, error.message || "Invalid Token");
    }
};

module.exports = checkToken