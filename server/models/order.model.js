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
                defaultValue: "pending"
            }
        },
        {
            tableName: "orders",
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true,
            indexes: [
                {
                    unique: false,
                    fields: ["user_id", "status"]
                }
            ]
        });
};