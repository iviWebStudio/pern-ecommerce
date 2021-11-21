module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "product",
        {
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
                allowNull: true,
                unique: false,
                indexes: true
            },
            total_sales: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                unique: false,
                indexes: true
            },
            status: {
                type: Sequelize.ENUM("stock", "low", "out"),
                defaultValue: "stock",
                unique: false,
                indexes: true
            }
        },
        {
            tableName: "products",
            modelName: "product",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true,
        });
};