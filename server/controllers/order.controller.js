const db = require("../models");
const {mapData} = require("../helpers/utils");
const {validateRequest, validateOrderItem} = require("../helpers/validation");
const {getValidParams, getOrderingValidParams} = require("../helpers/services");
const {ErrorHandler} = require("../helpers/error");
const Op = db.Sequelize.Op;
const Order = db.order;
const User = db.user;
const OrderItem = db.orderitem;
const dbFailureMessage = "Some error occurred with orders database."

const validateRequestFilterParams = params => {
    const {status, order_id, user_id, date_after, date_before, order_by, order, offset, limit,} = params;

    const args = {};

    args.offset = validateRequest.offset(offset);
    args.limit = validateRequest.limit(limit);

    if (order_by || order) {
        const validatedOrderBy = validateRequest.orderBy(order_by, getOrderingValidParams.order);
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
        const before = new Date(date_before);
        if (isNaN(before.valueOf())) {
            throw new ErrorHandler(400, "Invalid date_before passed.")
        }

        Object.assign(createdAt, {
            [Op.lt]: before
        })
    }

    if (Object.keys(createdAt).length) {
        args.createdAt = createdAt;
    }

    const where = {};
    if (user_id) {
        if (parseInt(user_id) !== +user_id || user_id < 0) {
            throw new ErrorHandler(400, "invalid user_id!")
        }
        where.user_id = user_id;
    }

    if (order_id) {
        if (parseInt(order_id) !== +order_id || order_id < 0) {
            throw new ErrorHandler(400, "invalid order_id!")
        }
        where.id = order_id;
    }

    if (status) {
        if (!["pending", "process", "completed"].includes(status)) {
            throw new ErrorHandler(400, "invalid status passed.")
        }
        where.status = status;
    }

    if (Object.keys(where).length) {
        args.where = where
    }
    return args;
}

const updateUserOrderCountHandler = async (userId, count, transaction) => {
    try {
        const user = await User.findByPk(userId);
        const {order_count} = user;
        const updatedCount = +order_count + count;

        return await User.update({
            order_count: updatedCount
        }, {
            where: {
                id: user.id
            },
            transaction: transaction
        })
    } catch (e) {
        throw new ErrorHandler(400, e.message || e)
    }
}

/**
 *
 * @param orderItem
 * @param orderId
 * @param transaction
 * @returns {Promise<never>|any}
 */
const updateOrderItemHandler = async (orderItem, orderId, transaction) => {
    const id = orderItem.id;
    const mapped = mapData(orderItem, getValidParams.orderItems);
    delete mapped.order_id;

    try {
        return OrderItem.update(mapped, {
            where: {
                id: id,
                order_id: orderId
            },
            transaction: transaction
        })
    } catch (e) {
        throw new ErrorHandler(400, e.message || e)
    }
}

/**
 *
 * @param itemsData
 * @param orderId
 * @param transaction
 * @returns {Promise<unknown[]>}
 */
const updateOrderHandler = async (itemsData, orderId, transaction) => {
    if (!Array.isArray(itemsData) || !itemsData.length) {
        return Promise.reject("empty order items passed.");
    }

    if (!orderId || parseInt(orderId) !== +orderId || orderId < 1) {
        return Promise.reject("invalid order id passed.");
    }

    const promises = []

    for (const orderItem of itemsData) {
        try {
            const id = orderItem.id;
            await updateOrderItemHandler(orderItem, orderId, transaction).then(num => {
                if (!num.length || !num.includes(1)) {
                    promises.push(Promise.reject(`invalid item id=${id}.`));
                } else {
                    promises.push(Promise.resolve(id));
                }
            })
                .catch(err => {
                    promises.push(Promise.reject(err.message))
                })
        } catch (err) {
            promises.push(Promise.reject(err.message))
        }
    }

    return Promise.all(promises)
}

/**
 * Add an order in the database.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const add = async (req, res) => {
    const orderData = mapData(req.body, getValidParams.order);

    if (!orderData.user_id) {
        return res.status(500).send({
            message: "order user_id is required!"
        });
    }

    if (!orderData.status) {
        return res.status(500).send({
            message: "order status is required!"
        });
    }

    if (!orderData.sale_total || typeof (orderData.sale_total) !== "number") {
        return res.status(500).send({
            message: "order sale_total is required!"
        });
    }

    if (!orderData.total || typeof (orderData.total) !== "number") {
        return res.status(500).send({
            message: "order total is required!"
        });
    }

    if (!orderData.items || !Array.isArray(orderData.items) || !orderData.items.length) {
        return res.status(500).send({
            message: "order items array is required!"
        });
    }

    try {
        const orderId = await db.sequelize.transaction(async t => {
            const order = await Order.create(orderData, {transaction: t});
            const orderItems = orderData.items;

            orderItems.map((orderItem, orderItemIndex) => {
                orderItem.order_id = order.id;
                orderItem = mapData(orderItem, getValidParams.orderItems);
                validateOrderItem(orderItem)
                orderItems[orderItemIndex] = orderItem;
            })

            await OrderItem.bulkCreate(orderItems, {transaction: t});
            await updateUserOrderCountHandler(order.user_id, 1, t);
            return order.id;
        });

        return await findOne({
            params: {
                id: orderId
            }
        }, res);
    } catch (error) {
        return res
            .status(500)
            .send({
                message: error.original.detail || dbFailureMessage
            })
    }

};

/**
 * Update order by the id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const update = async (req, res) => {
    const id = req.params.id;
    const orderData = mapData(req.body, getValidParams.order);
    delete orderData.user_id;

    if (!orderData || !Object.keys(orderData).length) {
        return res.status(500).send({
            message: "No provided parameters!"
        });
    }

    try {
        const orderId = await db.sequelize.transaction(async t => {
            const items = orderData.items;
            delete orderData.items;
            await Order.update(orderData, {
                where: {
                    id: id
                },
                transaction: t
            });

            if (!items || !Array.isArray(items) || !items.length) {
                return id;
            }

            return await updateOrderHandler(items, id, t).then(() => {
                return id;
            }).catch((e) => {
                throw new ErrorHandler(400, e)
            })

        });

        return await findOne({
            params: {
                id: orderId
            }
        }, res);
    } catch (error) {
        if (error.original && error.original.code) {
            error.message = error.original.code + ':' + (error.original.detail || dbFailureMessage)
        }
        return res
            .status(500)
            .send({
                message: error.message || dbFailureMessage
            })
    }
};

/**
 * Delete order by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        await db.sequelize.transaction(async t => {
            const order = await Order.findByPk(id);

            const deleted = await Order.destroy({
                where: {id: id},
                transaction: t
            });

            if ((!deleted.length || !deleted.includes(1)) && deleted !== 1) {
                throw new Error("nothing deleted")
            }

            await updateUserOrderCountHandler(order.user_id, -1, t);

            return id;
        });

        return res.send({
            message: "Order was deleted successfully!"
        });
    } catch (err) {
        throw new ErrorHandler(501, err.message ? err.message : dbFailureMessage);
    }
};

/**
 * Delete all orders.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteAll = async (req, res) => {
    try {
        const failed = await db.sequelize.transaction(async t =>
            await Order.destroy({
                truncate: true,
                cascade: true,
                transaction: t
            })
                .then(() => {
                    return false;

                })
                .catch(err => {
                    return err
                }));

        if (failed) {
            return res.status(500).send({
                message: failed || "nothing deleted"
            });
        }

        return res.send({
            message: "Order was deleted successfully!"
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message || dbFailureMessage
        });
    }
};

/**
 * Find an order by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findOne = async (req, res) => {
    if (parseInt(req.params.id) !== +req.params.id) {
        return res.status(500).send({
            message: "invalid id provided."
        });
    }

    return await Order.findByPk(req.params.id)
        .then(async order => {
            if (!order) {
                return res.status(500).send({
                    message: "order not found"
                });
            }
            // noinspection JSUnresolvedFunction
            const items = await order.getOrderItems();
            res.status(200).send({
                id: order.id,
                user_id: order.user_id,
                status: order.status,
                sale_total: order.sale_total,
                total: order.total,
                items: items,
                created_at: order.created_at,
                updated_at: order.updated_at,
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
};

/**
 * Find all orders.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAll = async (req, res) => {
    try {
        const args = validateRequestFilterParams(req.body);
        await Order.findAll(args)
            .then(order => {
                return res.status(200).send(order);
            })
            .catch(err => {
                throw new Error(err)
            });
    } catch (e) {
        res.status(500).send({
            message: e.message || dbFailureMessage
        });
    }
};

/**
 * Find all orders for user.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const addOrderForCurrentUser = async (req, res) => {
    req.body.user_id = req.user.id;
    return add(req, res);
};

/**
 * Find all orders for current user.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAllForCurrentUser = async (req, res) => {
    req.body.user_id = req.user.id;
    return await findAll(req, res);
};

/**
 * Find all orders by status.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findOrderForCurrentUser = async (req, res) => {
    try {
        await Order.findOne({
            where: {
                order_id: req.params.order_id,
                user_id: req.user.id
            }
        })
            .then(order => {
                if (!order) {
                    throw new Error("order not found!")
                }
                return res.status(200).send(order);
            })
            .catch(err => {
                throw new Error(err)
            });
    } catch (e) {
        new ErrorHandler(400, e.message || dbFailureMessage)
    }
};

module.exports = {
    add,
    update,
    deleteOne,
    deleteAll,
    findOne,
    findAll,
    addOrderForCurrentUser,
    findAllForCurrentUser,
    findOrderForCurrentUser,
};