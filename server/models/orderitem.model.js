module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "orderitem",
        {
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
                type: Sequelize.UUID,
                allowNull: false
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
        },
        {
            tableName: "orderitems",
            timestamps: false,
            indexes: [
                {
                    unique: false,
                    fields: ["order_id"]
                }
            ]
        });
};