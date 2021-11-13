module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "user",
        {
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
            }
        },
        {
            tableName: "users",
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true,
        }
    );
};