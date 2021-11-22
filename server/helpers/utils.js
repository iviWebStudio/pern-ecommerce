const bcrypt = require("bcrypt");
const {ErrorHandler} = require("./error");

const mapData = (inputObj, allParams) => {
    const data = {}

    Object.keys(inputObj).map(param => {
        if (allParams.indexOf(param) !== -1 && inputObj[param]) {
            data[param] = inputObj[param];
        }
    })
    return data;
}

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    } catch (e) {
        throw new ErrorHandler(409, e)
    }
};

const comparePassword = async (password, passwordHash) => {
    try {
        return await bcrypt.compare(password, passwordHash)
    } catch (e) {
        throw new ErrorHandler(409, e)
    }
}

const parseOrderItems = (items, orderId) => {
    items.forEach((orderItem) => {
        if (typeof orderItem !== "object") {
            throw new Error("invalid orderItem object passed.")
        }

        orderItem.order_id = orderId;
    })
}

module.exports = {
    mapData,
    hashPassword,
    comparePassword,
    parseOrderItems
}