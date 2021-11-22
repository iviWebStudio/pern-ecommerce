const pino = require('pino')
require("dotenv").config();

const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

module.exports = {
    logger
};