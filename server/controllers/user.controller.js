const db = require("../models");
const {mapData, hashPassword} = require("../helpers/utils");
const {isEmail} = require("../helpers/validation");
const Op = db.Sequelize.Op;
const User = db.user;
const dbFailureMessage = "Some error occurred with users database."
const allParams = ["login", "password", "email", "first_name", "last_name", "phone", "role", "order_count"];

/**
 * Add an user in the database.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const add = async (req, res) => {
    if (!req.body.login) {
        return res.status(400).send({
            message: "user login is required!"
        });
    }

    if (req.body.login.length < 6 || req.body.login.length > 63) {
        return res.status(400).send({
            message: "user login must contain 6-63 characters!"
        });
    }

    if (!req.body.email || !isEmail(req.body.email)) {
        res.status(400).send({
            message: "user email is required!"
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).send({
            message: "user password is required!"
        });
        return;
    }

    if (req.body.password.length < 6 || req.body.password.length > 63) {
        return res.status(400).send({
            message: "user password must contain 6-63 characters!"
        });
    }

    //todo check userename  and email exists

    const user = mapData(req.body, allParams);
    user.password = await hashPassword(user.password)

    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
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
    const user = mapData(req.body, allParams);

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
    const {offset, limit} = req.body;

    User.findAll({
        offset: offset || 0,
        limit: limit || 100
    })
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
 * Find user by login.
 *
 * @returns {Promise<void>}
 */
const findByLogin = async (login) => {
    User.findAll({
        where: {
            login: login,
        },
        limit: 1
    })
        .then(user => {
            return user.shift()
        }).catch(() => {
        return {}
    });
};

/**
 * Find user by email.
 *
 * @returns {Promise<void>}
 */
const findByEmail = async (email) => {
    User.findAll({
        where: {
            email: email,
        },
        limit: 1
    })
        .then(user => {
            return user.shift()
        }).catch(() => {
        return {}
    });
};

/**
 * Find users with role.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAllByRole = async (req, res) => {
    const {role} = req.params;

    if (!role) {
        return res.status(500).send({
            message: "role param required."
        });
    }

    if (["admin", "customer"].indexOf(role) === -1) {
        return res.status(500).send({
            message: "role is not exists."
        });
    }
    const {offset, limit} = req.body;

    User.findAll({
        where: {
            role: role,
        },
        offset: offset || 0,
        limit: limit || 100
    })
        .then(user => {
            res.status(200).send(user);
        }).catch(err => {
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
    findByLogin,
    findByEmail,
    findAllByRole,
    getProfile,
    search
};