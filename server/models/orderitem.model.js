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
                type: Sequelize.INTEGER,
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
                type: Sequelize.FLOAT,
                allowNull: false
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        },
        {
            tableName: "orderitems",
            modelName: "orderitem",
            underscored: true,
            timestamps: false,
        });
};