const db = require("../models");
const {mapData, hashPassword} = require("../helpers/utils");
const {getValidParams, addUserHandler, getOrderingValidParams} = require("../helpers/services");
const {validateRequest, isEmail} = require("../helpers/validation");
const {ErrorHandler} = require("../helpers/error");
const Op = db.Sequelize.Op;
const User = db.user;
const dbFailureMessage = "Some error occurred with users database."

/**
 *
 * @param params
 * @returns {{}}
 */
const validateRequestFilterParams = params => {
    const {
        login,
        email,
        first_name,
        last_name,
        phone,
        role,
        order_count,
        date_after,
        date_before,
        order_by,
        order,
        offset,
        limit,
    } = params;

    const args = {};

    args.offset = validateRequest.offset(offset);
    args.limit = validateRequest.limit(limit);

    if (order_by || order) {
        const validatedOrderBy = validateRequest.orderBy(order_by, getOrderingValidParams.user);
        const validatedOrder = validateRequest.order(order);

        args.order = validatedOrderBy === "created_at" || validatedOrderBy === "updated_at" ?
            [Order, validatedOrderBy, validatedOrder] :
            [validatedOrderBy, validatedOrder];
    }

    const createdAt = {}
    if (date_after) {
        const after = new Date(date_after);
        if (isNaN(after.valueOf())) {
            throw new ErrorHandler(400, "Invalid date_after passed.")
        }

        Object.assign(createdAt, {
            [Op.gt]: after
        })
    }

    if (date_before) {
        const before = new Date(date_before).valueOf();
        if (isNaN(before.valueOf())) {
            throw new ErrorHandler(400, "Invalid date_before passed.")
        }

        Object.assign(createdAt, {
            [Op.lt]: before
        })
    }

    const where = {};
    if (createdAt
        && Object.keys(createdAt).length === 0
        && Object.getPrototypeOf(createdAt) === Object.prototype) {
        where.created_at = createdAt;
    }

    if (login) {
        where.login = {[Op.like]: `%${login}%`}
    }

    if (email) {
        if (!isEmail(email)) {
            throw new ErrorHandler(400, "invalid email!")
        }
        where.email = {[Op.like]: `%${email}%`}
    }

    if (first_name) {
        where.first_name = {[Op.like]: `%${first_name}%`}
    }

    if (last_name) {
        where.last_name = {[Op.like]: `%${last_name}%`}
    }

    if (phone) {
        where.phone = {[Op.like]: `%${phone}%`}
    }

    if (role) {
        where.role = role;
    }
    if (order_count) {
        where.order_count = order_count;
    }

    if (Object.keys(where).length) {
        args.where = where
    }
    return args;
}

/**
 * Add an user in the database.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const add = async (req, res) => {
    const user = await addUserHandler(req.body);
    return res.send(user);
};

/**
 * Update user by the id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const update = async (req, res) => {
    const id = req.params.id;
    const user = mapData(req.body, getValidParams.user);

    if (!user || !Object.keys(user).length) {
        return res.status(500).send({
            message: "No provided parameters!"
        });
    }

    if (user.password) {
        user.password = await hashPassword(user.password)
    }

    User.update(user,
        {
            where: {id: id}
        })
        .then(num => {
            if (num.length && num.includes(1)) {
                findOne({params: {id: id}}, res)
            } else {
                res.status(500).send({
                    message: dbFailureMessage
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        })
};

/**
 * Delete user by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteOne = async (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num.length && num.includes(1)) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.status(500).send({
                    message: dbFailureMessage
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
};

/**
 * Find an user by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findOne = async (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(user => {
            res.status(200).send(user);
        }).catch(err => {
        res.status(500).send({
            message: err.message || dbFailureMessage
        });
    });
};

/**
 * Find all users.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAll = async (req, res) => {
    User.findAll(validateRequestFilterParams(req.body))
        .then(user => {
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
};

/**
 * Get user profile info by ID.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getProfile = async (req, res) => {
    const {id} = req.user;

    return await findOne({
        params: {
            id: id
        }
    }, res);
};

/**
 * Search for login, email, first and lastnames and phone  %like% relevance
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const search = async (req, res) => {
    const {key} = req.params;

    if (!key) {
        res.status(500).send({
            message: "No provided search parameter"
        });
        return;
    }

    const {offset, limit} = req.body;
    User.findAll({
        where: {
            [Op.or]: [
                {login: {[Op.like]: `%${key}%`}},
                {email: {[Op.like]: `%${key}%`}},
                {first_name: {[Op.like]: `%${key}%`}},
                {last_name: {[Op.like]: `%${key}%`}},
                {phone: {[Op.like]: `%${key}%`}},
            ]
        },
        offset: offset || 0,
        limit: limit || 100
    })
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
}

module.exports = {
    add,
    update,
    deleteOne,
    findOne,
    findAll,
    getProfile,
    search
};