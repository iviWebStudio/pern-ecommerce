const bcrypt = require("bcrypt");

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
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, passwordHash) =>
    await bcrypt.compare(password, passwordHash);

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