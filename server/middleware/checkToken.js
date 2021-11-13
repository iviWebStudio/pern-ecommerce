const jwt = require("jsonwebtoken");
const {ErrorHandler} = require("../helpers/error");

const checkToken = (req, res, next) => {
    const bearerHeader = req.header("authorization");
    if (!bearerHeader) {
        throw new ErrorHandler(401, "Token missing");
    }

    try {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.user = jwt.verify(bearerToken, process.env.JWT_SECRET);
        next();
    } catch (error) {
        throw new ErrorHandler(401, error.message || "Invalid Token");
    }
};

module.exports = checkToken