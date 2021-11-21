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

const validateOrderItem = orderItem => {
    if (typeof orderItem !== "object") {
        throw new Error("invalid orderItem object passed.")
    }

    if (!orderItem.title) {
        throw new Error("order item title required.")
    }

    if (!orderItem.quantity) {
        throw new Error("order item quantity required.")
    }

    if (!orderItem.price) {
        throw new Error("order item price required.")
    }

    if (!orderItem.sale_price) {
        orderItem.sale_price = orderItem.price;
    }

    orderItem.total = orderItem.quantity * orderItem.sale_price;
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
    validateOrderItem,
    parseOrderItems
}