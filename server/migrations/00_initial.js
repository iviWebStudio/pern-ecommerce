const {Sequelize} = require('sequelize');

module.exports = {
    // `query` was passed in the `index.js` file
    up: async (query) => {
        await query.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            login: {
                type: Sequelize.STRING(64),
                allowNull: false,
                unique: true,
                validate: {
                    len: [6, 63]
                }
            },
            password: {
                type: Sequelize.STRING(64),
                allowNull: false,
                validate: {
                    len: [6, 63]
                }
            },
            email: {
                type: Sequelize.STRING(64),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            phone: {
                type: Sequelize.STRING(32),
                defaultValue: ""
            },
            role: {
                type: Sequelize.ENUM("admin", "customer"),
                defaultValue: "customer"
            },
            order_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await query.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING(32),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            sku: {
                type: Sequelize.STRING(16),
                defaultValue: "",
                unique: true
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            sale_price: {
                type: Sequelize.FLOAT,
                defaultValue: 0
            },
            length: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            width: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            height: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            weight: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: false,
                indexes: true,
            },
            total_sales: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                unique: false,
                indexes: true,
            },
            status: {
                type: Sequelize.ENUM("stock", "low", "out"),
                defaultValue: "stock",
                unique: false,
                indexes: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await query.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: false,
                indexes: true,
            },
            status: {
                type: Sequelize.ENUM("pending", "process", "completed"),
                allowNull: false,
                defaultValue: "pending",
                unique: false,
                indexes: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await query.createTable('orderitems', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING(32),
                allowNull: false
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: false,
                indexes: true,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                }
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            sale_price: {
                type: Sequelize.FLOAT
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        });

    },
    down: async (query) => {
        await query.dropTable('users');
        await query.dropTable('products');
        await query.dropTable('orders');
        await query.dropTable('orderitems');
    }
}