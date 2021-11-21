/**
 *
 * @param offset
 * @returns {number}
 */
const validateRequestOffset = offset => {
    if (!offset) {
        return 0;
    }

    if (typeof offset !== "number") {
        throw new Error("offset should be numeric.")
    }

    if (offset < 0) {
        throw new Error("offset should be numeric.")
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
        throw new Error("limit should be numeric.")
    }

    if (limit < 0) {
        throw new Error("limit should be numeric.")
    }

    if (limit > 1000) {
        throw new Error("limit too big.")
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
        throw new Error("order should be ASC or DESC.")
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
        throw new Error("no available order_by parameter.")
    }

    if (orderByOptions.includes(orderBy)) {
        throw new Error("invalid order_by parameter.")
    }

    return orderBy;
}

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