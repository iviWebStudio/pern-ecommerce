const express = require("express");
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const routes = require("./routes");
const {handleError} = require("./helpers/error");
const invalidEndpoint = require("./middleware/invalidEndpoint");
const helmet = require("helmet");

const app = express();

app.set("trust proxy", 1);
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use("/api", routes);

app.get("/", (req, res) =>
    res.send("<h1 style='text-align: center'>WELCOME TO THE PERN E-COMMERCE API</h1>")
);
app.use(invalidEndpoint);
app.use(handleError);

module.exports = app;