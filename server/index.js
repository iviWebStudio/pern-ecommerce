require("dotenv").config({path: __dirname + "/.env"});
const http = require("http");
const app = require("./app");
const {logger} = require("./helpers/logger");

const server = http.createServer(app);

const port = parseInt(process.env.APP_PORT) || 8080;

server.listen(port, () => logger.info(`App listening at http://localhost:${port}`));