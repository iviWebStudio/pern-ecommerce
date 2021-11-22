require("dotenv").config();

module.exports = {
    HOST: process.env.PGDB_HOST,
    USER: process.env.PGDB_USER,
    PASSWORD: process.env.PGDB_PASS,
    DB: process.env.PGDB_NAME,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};