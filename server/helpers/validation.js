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


module.exports = {
    validateRequest: {
        offset: validateRequestOffset,
        limit: validateRequestLimit,
        order: validateRequestOrder,
        orderBy: validateRequestOrderBy,
    }
}