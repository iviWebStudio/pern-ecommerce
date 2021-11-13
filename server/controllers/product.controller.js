const db = require("../models");
const Op = db.Sequelize.Op;
const Product = db.product;
const dbFailureMessage = "Some error occurred with database:01."

const mapProductData = inputObj => {
    const product = {}
    const allParams = ["title", "price", "description", "sku", "sale_price", "length", "width", "height", "weight", "stock", "total_sales", "status"];

    Object.keys(inputObj).map(param => {
        if (allParams.includes(param) && inputObj[param]) {
            product[param] = inputObj[param];
        }
    })
    return product;
}

/**
 * Add a product in the database.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const add = async (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "product title is required!"
        });
        return;
    }

    if (!req.body.price) {
        res.status(400).send({
            message: "product price is required!"
        });
        return;
    }

    const product = mapProductData(req.body);

    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || dbFailureMessage
            });
        });
};

/**
 * Update product by the id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const update = async (req, res) => {
    const id = req.params.id;

    const product = mapProductData(req.body);
    if (!Object.keys(product).length) {
        res.status(500).send({
            message: "No fields provided",
        });
    }

    Product.update(product,
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
 * Delete product by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteOne = async (req, res) => {
    const id = req.params.id;

    Product.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num.length && num.includes(1)) {
                res.send({
                    message: "Product was deleted successfully!"
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
 * Delete all products.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteAll = async (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} products were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || dbFailureMessage
            });
        });
};

/**
 * Find a product by id.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findOne = async (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(product => {
            res.status(200).send(product);
        }).catch(err => {
        res.status(500).send({
            message:
                err.message || dbFailureMessage
        });
    });
};

/**
 * Find all products.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAll = async (req, res) => {
    Product.findAll()
        .then(product => {
            res.status(200).send(product);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || dbFailureMessage
            });
        });
};

/**
 * Find products by status.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findAllByStatus = async (req, res) => {
    if (!req.params.status) {
        res.status(500).send({
            message: "status param required."
        });
    }

    Product.findAll({
        where: {
            status: req.params.status,
        }
    })
        .then(products => {
            res.status(200).send(products);
        }).catch(err => {
        res.status(500).send({
            message:
                err.message || dbFailureMessage
        });
    });
};

/**
 * Search fo title, description sku %like% relevance
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const search = async (req, res) => {
    let args = [];

    if (req.query.q) {
        args.push({sku: {[Op.like]: `%${req.query.q}%`}})
        args.push({title: {[Op.like]: `%${req.query.q}%`}})
        args.push({description: {[Op.like]: `%${req.query.q}%`}})
    } else {

        if (req.query.sku) {
            args.push({sku: {[Op.like]: `%${req.query.sku}%`}})
        }

        if (req.query.title) {
            args.push({title: {[Op.like]: `%${req.query.title}%`}})
        }

        if (req.query.desc) {
            args.push({description: {[Op.like]: `%${req.query.desc}%`}})
        }
    }

    if (!args.length) {
        res.status(500).send({
            message: "No provided parameter [sku, title, desc, q]"
        });
        return;
    }

    Product.findAll({
        where: {
            [Op.or]: args
        }
    })
        .then(products => {
            res.status(200).send(products);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || dbFailureMessage
            });
        });
}

module.exports = {
    add,
    update,
    deleteOne,
    deleteAll,
    findOne,
    findAll,
    findAllByStatus,
    search
};