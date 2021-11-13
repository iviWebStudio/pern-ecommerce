const dbConfig = require("../config");
const Sequelize = require("sequelize");
const Umzug = require('umzug');
const path = require("path");
const {logger} = require("../helpers/logger");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
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
    await umzug.up()
    logger.info('All migrations performed successfully')
})();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);
db.order = require("./order.model")(sequelize, Sequelize);
db.orderitem = require("./orderitem.model")(sequelize, Sequelize);

module.exports = db;