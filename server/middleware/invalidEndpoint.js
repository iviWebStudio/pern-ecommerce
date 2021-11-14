const {ErrorHandler} = require("../helpers/error");

const invalidEndpoint = () => {
    throw new ErrorHandler(404, "invalid endpoint");
};

module.exports = invalidEndpoint;