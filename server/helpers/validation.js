/**
 *
 * @param offset
 * @returns {number}
 */
const {ErrorHandler} = require("./error");
const validateRequestOffset = offset => {
    if (!offset) {
        return 0;
    }

    if (typeof offset !== "number") {
        throw new ErrorHandler(400, "offset should be numeric.")
    }

    if (offset < 0) {
        throw new ErrorHandler(400, "offset should be numeric.")
    }

    return offset
}

/**
 *
 * @param limit
 * @returns {number}
 */
const validateRequestLimit = limit => {
    if (!limit) {
        return 0;
    }

    if (typeof limit !== "number") {
        throw new ErrorHandler(400, "limit should be numeric.")
    }

    if (limit < 0) {
        throw new ErrorHandler(400, "limit should be numeric.")
    }

    if (limit > 1000) {
        throw new ErrorHandler(400, "limit too big.")
    }

    return limit
}

/**
 *
 * @param order
 * @returns {string}
 */
const validateRequestOrder = order => {
    if (!order) {
        return "DESC";
    }

    if (["DESC", "ASC"].includes(order.toUpperCase())) {
        throw new ErrorHandler(400, "order should be ASC or DESC.")
    }

    return order.toUpperCase();
}

/**
 *
 * @param orderBy
 * @param orderByOptions
 * @returns {string}
 */
const validateRequestOrderBy = (orderBy = "", orderByOptions = []) => {
    if (!orderBy) {
        return "id";
    }

    if (!Array.isArray(orderByOptions) || !orderByOptions.length) {
        throw new ErrorHandler(400, "no available order_by parameter.")
    }

    if (orderByOptions.includes(orderBy)) {
        throw new ErrorHandler(400, "invalid order_by parameter.")
    }

    return orderBy;
}

const validateOrderItem = orderItem => {
    if (typeof orderItem !== "object") {
        throw new ErrorHandler(400, "invalid orderItem object passed.")
    }

    if (!orderItem.title) {
        throw new ErrorHandler(400, "order item title required.")
    }

    if (!orderItem.quantity) {
        throw new ErrorHandler(400, "order item quantity required.")
    }

    if (!orderItem.price) {
        throw new ErrorHandler(400, "order item price required.")
    }

    if (!orderItem.sale_price) {
        orderItem.sale_price = orderItem.price;
    }

    orderItem.total = orderItem.quantity * orderItem.sale_price;
}

const isEmail = email => {
    if (typeof email !== "string") {
        return false;
    }

    if (email.length < 6) {
        return false;
    }

    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
}


module.exports = {
    validateRequest: {
        offset: validateRequestOffset,
        limit: validateRequestLimit,
        order: validateRequestOrder,
        orderBy: validateRequestOrderBy,
    },
    isEmail,
    validateOrderItem,
}