const dbConfig = require("../config");
const Sequelize = require("sequelize");
const Umzug = require('umzug');
const path = require("path");
const {logger} = require("../helpers/logger");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
})
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const umzug = new Umzug({
    migrations: {
        path: path.join(__dirname, '../migrations'),
        params: [
            sequelize.getQueryInterface()
        ]
    },
    storage: 'sequelize',
    storageOptions: {
            sequelize: sequelize
        }
    })

;(async () => {
    await umzug.up().then(() => {
        logger.info('All migrations performed successfully')
    })

})();


const User = require("./user.model")(sequelize, Sequelize);
const Product = require("./product.model")(sequelize, Sequelize);
const Order = require("./order.model")(sequelize, Sequelize);
const OrderItem = require("./orderitem.model")(sequelize, Sequelize);

User.hasMany(Order, {as: "Orders"});
Order.belongsTo(User);
Order.hasMany(OrderItem, {as: "OrderItems"})
OrderItem.belongsTo(Order)

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    user: User,
    product: Product,
    order: Order,
    orderitem: OrderItem,
};