module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "order",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("pending", "process", "completed"),
                allowNull: false,
                defaultValue: "pending",
                unique: false,
                indexes: true
            },
            sale_total: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        },
        {
            tableName: "orders",
            modelName: "order",
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true,
        });
};