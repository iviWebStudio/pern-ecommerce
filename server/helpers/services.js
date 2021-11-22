const db = require("../models");
const jwt = require("jsonwebtoken");

/**
 *
 * @type {{product: string[], user: string[], orderItems: string[], order: string[]}}
 */
const getValidParams = {
    user: ["login", "password", "email", "first_name", "last_name", "phone", "role", "order_count"],
    product: ["title", "price", "description", "sku", "sale_price", "length", "width", "height", "weight", "stock", "total_sales", "status"],
    order: ["user_id", "status", "items", "sale_total", "total"],
    orderItems: ["title", "order_id", "quantity", "price", "sale_price", "total"]
}

const getOrderingValidParams = {
    user: ["login", "email", "first_name", "last_name", "phone", "role", "order_count", "created_at", "updated_at"],
    product: [],
    order: ["id", "user_id", "status", "created_at", "updated_at"],
}

const {isEmail} = require("../helpers/validation");
const {ErrorHandler} = require("../helpers/error");
const {mapData, hashPassword} = require("../helpers/utils");

const User = db.user;

/**
 *
 * @param field
 * @param value
 * @returns {Promise<*|boolean>}
 */
const getUserBy = async (field, value) => {
    const args = {};
    args[field] = value;
    const user = await User.findOne({
        where: args
    });
    return user || false;
}

/**
 *
 * @param login
 * @returns {Promise<*|boolean>}
 */
const checkUserLogin = async login => isEmail(login) ? await getUserBy("email", login.toLowerCase()) : await getUserBy("login", login);

/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const addUserHandler = async data => {
    if (!data) {
        throw new ErrorHandler(500, "no provided data.")
    }

    if (!data.login) {
        throw new ErrorHandler(500, "user login is required!");
    }

    if (data.login.length < 6 || data.login.length > 63) {
        throw new ErrorHandler(500, "user login must contain 6-63 characters!");
    }

    if (!data.email || !isEmail(data.email)) {
        throw new ErrorHandler(500, "user email is required!");
    }

    if (!data.password) {
        throw new ErrorHandler(500, "user password is required!");
    }

    if (data.password.length < 6 || data.password.length > 63) {
        throw new ErrorHandler(500, "user password must contain 6-63 characters!");
    }

    const user = mapData(data, getValidParams.user);

    const checkByEmail = await getUserBy("email", user.email);
    if (checkByEmail) {
        throw new ErrorHandler(422, "use another email.");
    }

    const checkByLogin = await getUserBy("login", user.login);
    if (checkByLogin) {
        throw new ErrorHandler(422, "use another login.");
    }

    user.password = await hashPassword(user.password)

    const userData = await User.create(user);
    if (!userData) {
        throw new ErrorHandler(403, "cannot create user");
    }
    return userData
}

/**
 *
 * @param data
 * @returns {Promise<{token: (*), refreshToken: (*)}>}
 */
const generateRefreshToken = async data => {
    const payload = await verifyRefreshToken(data);

    const token = await extendTokenHandler(payload);

    const refreshToken = await refreshTokenHandler(payload);

    return {
        token,
        refreshToken,
    };
}

/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const extendTokenHandler = async data => {
    try {
        return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: "60s"});
    } catch (error) {
        throw new ErrorHandler(500, "An error occurred");
    }
}

/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const refreshTokenHandler = async data => {
    try {
        return jwt.sign(data, process.env.JWT_REFRESH_SECRET, {expiresIn: "1h"});
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

/**
 *
 * @param token
 * @returns {Promise<{id, isAdmin: (boolean|*), username}>}
 */
const verifyRefreshToken = async token => {
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return {
            id: payload.id,
            isAdmin: payload.isAdmin,
            username: payload.username,
        };
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

module.exports = {
    getUserBy,
    getValidParams,
    getOrderingValidParams,
    checkUserLogin,
    refreshTokenHandler,
    extendTokenHandler,
    addUserHandler,
    generateRefreshToken
}